from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models import all_models
from app.schemas import all_schemas

router = APIRouter()

# Mock Auth Dependency
def get_current_user(db: Session = Depends(get_db)) -> all_models.User:
    user = db.query(all_models.User).first()
    if not user:
        # Create a mock user if none exists
        user = all_models.User(
            email="admin@quizforge.com",
            name="Admin User",
            hashed_password="hashedpassword",
            role="admin"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.get("/users/me", response_model=all_schemas.UserResponse)
def read_users_me(current_user: all_models.User = Depends(get_current_user)):
    return current_user

@router.get("/assessments", response_model=List[all_schemas.AssessmentResponse])
def read_assessments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    assessments = db.query(all_models.Assessment).offset(skip).limit(limit).all()
    return assessments

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

@router.get("/question-banks", response_model=List[all_schemas.QuestionBankResponse])
def read_question_banks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    banks = db.query(all_models.QuestionBank).offset(skip).limit(limit).all()
    return banks
