from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models import all_models
from app.schemas import all_schemas
from app.core.security import verify_password, get_password_hash, create_access_token
from app.api.deps import get_current_user

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
