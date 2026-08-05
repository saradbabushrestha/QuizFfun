from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import httpx
from datetime import datetime

from app.db.database import get_db
from app.models import all_models
from app.schemas import all_schemas
from app.core.config import settings
from app.core.security import create_access_token

router = APIRouter()

# -----------------
# GOOGLE OAUTH
# -----------------

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

@router.get("/google/login")
def google_login(request: Request):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    
    redirect_uri = f"{request.base_url.scheme}://{request.client.host}:{request.url.port}{settings.API_V1_STR}/auth/google/callback"
    
    # We construct the URL manually or use httpx if we want, but simple string formatting is easiest
    auth_url = (
        f"{GOOGLE_AUTH_URL}?response_type=code"
        f"&client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
        f"&scope=openid%20email%20profile"
        f"&access_type=offline"
    )
    return RedirectResponse(auth_url)

@router.get("/google/callback")
async def google_callback(request: Request, code: str, db: Session = Depends(get_db)):
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    
    redirect_uri = f"{request.base_url.scheme}://{request.client.host}:{request.url.port}{settings.API_V1_STR}/auth/google/callback"
    
    async with httpx.AsyncClient() as client:
        # 1. Exchange code for token
        token_res = await client.post(GOOGLE_TOKEN_URL, data={
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri
        })
        
        if token_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange token with Google")
            
        token_data = token_res.json()
        access_token = token_data.get("access_token")
        
        # 2. Get User Info
        user_res = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if user_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch user info from Google")
            
        user_info = user_res.json()
        email = user_info.get("email")
        name = user_info.get("name", "Google User")
        avatar_url = user_info.get("picture")

    return handle_oauth_user(db, email, name, avatar_url)

# -----------------
# GITHUB OAUTH
# -----------------

GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USERINFO_URL = "https://api.github.com/user"
GITHUB_EMAILS_URL = "https://api.github.com/user/emails"

@router.get("/github/login")
def github_login(request: Request):
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured")
    
    redirect_uri = f"{request.base_url.scheme}://{request.client.host}:{request.url.port}{settings.API_V1_STR}/auth/github/callback"
    
    auth_url = (
        f"{GITHUB_AUTH_URL}?client_id={settings.GITHUB_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
        f"&scope=user:email"
    )
    return RedirectResponse(auth_url)

@router.get("/github/callback")
async def github_callback(request: Request, code: str, db: Session = Depends(get_db)):
    if not settings.GITHUB_CLIENT_ID or not settings.GITHUB_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured")
    
    redirect_uri = f"{request.base_url.scheme}://{request.client.host}:{request.url.port}{settings.API_V1_STR}/auth/github/callback"
    
    async with httpx.AsyncClient() as client:
        # 1. Exchange code for token
        token_res = await client.post(
            GITHUB_TOKEN_URL,
            headers={"Accept": "application/json"},
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": redirect_uri
            }
        )
        
        if token_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange token with GitHub")
            
        token_data = token_res.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            raise HTTPException(status_code=400, detail="GitHub returned invalid token")
        
        # 2. Get User Info
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json"
        }
        user_res = await client.get(GITHUB_USERINFO_URL, headers=headers)
        
        if user_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch user info from GitHub")
            
        user_info = user_res.json()
        name = user_info.get("name") or user_info.get("login", "GitHub User")
        avatar_url = user_info.get("avatar_url")
        
        # 3. Get User Email (GitHub might keep email private, requiring a second API call)
        email = user_info.get("email")
        if not email:
            emails_res = await client.get(GITHUB_EMAILS_URL, headers=headers)
            if emails_res.status_code == 200:
                emails = emails_res.json()
                primary_email = next((e["email"] for e in emails if e["primary"] and e["verified"]), None)
                if primary_email:
                    email = primary_email
                elif len(emails) > 0:
                    email = emails[0]["email"]
                    
        if not email:
            raise HTTPException(status_code=400, detail="Failed to retrieve email from GitHub")

    return handle_oauth_user(db, email, name, avatar_url)

# -----------------
# COMMON HANDLER
# -----------------

def handle_oauth_user(db: Session, email: str, name: str, avatar_url: str):
    # Check if user exists
    user = db.query(all_models.User).filter(all_models.User.email == email).first()
    
    if not user:
        # Create new user
        user = all_models.User(
            email=email,
            name=name,
            avatar_url=avatar_url,
            role="student",
            hashed_password=None # OAuth users don't have passwords
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    # Generate JWT
    access_token = create_access_token(subject=user.id)
    
    # Redirect back to frontend callback page with the token
    # In production, use your actual frontend URL (e.g., from settings.FRONTEND_URL)
    frontend_url = "http://localhost:5173"
    return RedirectResponse(f"{frontend_url}/auth/callback?token={access_token}")
