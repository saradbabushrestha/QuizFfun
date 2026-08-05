from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models import all_models
from app.schemas import all_schemas
from app.core.security import verify_password, get_password_hash, create_access_token
from app.api.deps import get_current_user
from app.core.grading import grade_attempt
from datetime import datetime
import uuid

router = APIRouter()

# --- AUTH ---
@router.post("/auth/register", response_model=all_schemas.UserResponse)
def register(user_in: all_schemas.UserCreate, db: Session = Depends(get_db)):
    user = db.query(all_models.User).filter(all_models.User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = all_models.User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        avatar_url=user_in.avatar_url
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/auth/login", response_model=all_schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(all_models.User).filter(all_models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=all_schemas.UserResponse)
def read_users_me(current_user: all_models.User = Depends(get_current_user)):
    return current_user

# --- ASSESSMENTS ---
@router.get("/assessments", response_model=List[all_schemas.AssessmentResponse])
def read_assessments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(all_models.Assessment).offset(skip).limit(limit).all()

@router.post("/assessments", response_model=all_schemas.AssessmentResponse)
def create_assessment(
    assessment: all_schemas.AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: all_models.User = Depends(get_current_user)
):
    db_assessment = all_models.Assessment(**assessment.model_dump(), creator_id=current_user.id)
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    return db_assessment

@router.get("/assessments/{assessment_id}", response_model=all_schemas.AssessmentResponse)
def read_assessment(assessment_id: str, db: Session = Depends(get_db)):
    db_assessment = db.query(all_models.Assessment).filter(all_models.Assessment.id == assessment_id).first()
    if db_assessment is None:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return db_assessment

# --- QUESTION BANKS ---
@router.get("/question-banks", response_model=List[all_schemas.QuestionBankResponse])
def read_question_banks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(all_models.QuestionBank).offset(skip).limit(limit).all()

@router.post("/question-banks", response_model=all_schemas.QuestionBankResponse)
def create_question_bank(
    bank: all_schemas.QuestionBankCreate,
    db: Session = Depends(get_db),
    current_user: all_models.User = Depends(get_current_user)
):
    db_bank = all_models.QuestionBank(**bank.model_dump(), owner_id=current_user.id)
    db.add(db_bank)
    db.commit()
    db.refresh(db_bank)
    return db_bank

# --- QUESTIONS ---
@router.get("/questions", response_model=List[all_schemas.QuestionResponse])
def read_questions(bank_id: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(all_models.Question)
    if bank_id:
        query = query.filter(all_models.Question.bank_id == bank_id)
    return query.offset(skip).limit(limit).all()

@router.post("/questions", response_model=all_schemas.QuestionResponse)
def create_question(
    question: all_schemas.QuestionCreate,
    db: Session = Depends(get_db),
    current_user: all_models.User = Depends(get_current_user)
):
    db_question = all_models.Question(**question.model_dump())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

# --- ATTEMPTS ---
@router.get("/attempts/{attempt_id}", response_model=all_schemas.AttemptResponse)
def get_attempt(attempt_id: str, db: Session = Depends(get_db), current_user: all_models.User = Depends(get_current_user)):
    attempt = db.query(all_models.Attempt).filter(
        all_models.Attempt.id == attempt_id, 
        all_models.Attempt.user_id == current_user.id
    ).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    return attempt

@router.post("/attempts", response_model=all_schemas.AttemptResponse)
def start_attempt(attempt_in: all_schemas.AttemptCreate, db: Session = Depends(get_db), current_user: all_models.User = Depends(get_current_user)):
    assessment = db.query(all_models.Assessment).filter(all_models.Assessment.id == attempt_in.assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    db_attempt = all_models.Attempt(
        id=f"att_{uuid.uuid4().hex[:8]}",
        assessment_id=attempt_in.assessment_id,
        user_id=current_user.id,
        status="in_progress",
        answers={}
    )
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)
    return db_attempt

@router.put("/attempts/{attempt_id}", response_model=all_schemas.AttemptResponse)
def update_attempt(attempt_id: str, attempt_in: all_schemas.AttemptUpdate, db: Session = Depends(get_db), current_user: all_models.User = Depends(get_current_user)):
    attempt = db.query(all_models.Attempt).filter(
        all_models.Attempt.id == attempt_id, 
        all_models.Attempt.user_id == current_user.id
    ).first()
    
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
        
    if attempt.status != "in_progress":
        raise HTTPException(status_code=400, detail="Cannot update a completed attempt")
        
    if attempt_in.answers is not None:
        attempt.answers = attempt_in.answers
    if attempt_in.time_spent_seconds is not None:
        attempt.time_spent_seconds = attempt_in.time_spent_seconds
        
    db.commit()
    db.refresh(attempt)
    return attempt

@router.post("/attempts/{attempt_id}/submit", response_model=all_schemas.AttemptResponse)
def submit_attempt(attempt_id: str, db: Session = Depends(get_db), current_user: all_models.User = Depends(get_current_user)):
    attempt = db.query(all_models.Attempt).filter(
        all_models.Attempt.id == attempt_id, 
        all_models.Attempt.user_id == current_user.id
    ).first()
    
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
        
    if attempt.status != "in_progress":
        raise HTTPException(status_code=400, detail="Attempt is already submitted")
        
    assessment = db.query(all_models.Assessment).filter(all_models.Assessment.id == attempt.assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    score, percentage, passed = grade_attempt(db, attempt, assessment)
    
    attempt.status = "submitted"
    attempt.score = score
    attempt.percentage = percentage
    attempt.passed = passed
    attempt.completed_at = datetime.utcnow()
    
    # Generate certificate if passed and certificates are enabled
    # Assuming certificate generation is enabled by default or in settings
    # We will generate it just based on pass condition for now
    if passed:
        cert = all_models.Certificate(
            id=f"cert_{uuid.uuid4().hex[:8]}",
            user_id=current_user.id,
            assessment_id=assessment.id,
            attempt_id=attempt.id,
            title=f"Certificate of Completion: {assessment.title}"
        )
        db.add(cert)
        
    db.commit()
    db.refresh(attempt)
    return attempt

# --- CERTIFICATES ---
@router.get("/certificates", response_model=List[all_schemas.CertificateResponse])
def get_certificates(db: Session = Depends(get_db), current_user: all_models.User = Depends(get_current_user)):
    return db.query(all_models.Certificate).filter(all_models.Certificate.user_id == current_user.id).all()
