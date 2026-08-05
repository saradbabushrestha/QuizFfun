from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# Users
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str = "student"
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Question Banks
class QuestionBankBase(BaseModel):
    name: str
    description: Optional[str] = None
    tags: List[str] = []

class QuestionBankCreate(QuestionBankBase):
    pass

class QuestionBankResponse(QuestionBankBase):
    id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Questions
class QuestionBase(BaseModel):
    type: str
    title: str
    body: Optional[str] = None
    difficulty: str = "medium"
    points: int = 10
    options: List[Dict[str, Any]] = []
    correct_answer: Optional[Any] = None
    explanation: Optional[str] = None
    hint: Optional[str] = None
    tags: List[str] = []

class QuestionCreate(QuestionBase):
    bank_id: str

class QuestionResponse(QuestionBase):
    id: str
    bank_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Assessments
class AssessmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "draft"
    sections: List[Dict[str, Any]] = []
    settings: Dict[str, Any] = {}
    tags: List[str] = []

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentResponse(AssessmentBase):
    id: str
    creator_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
