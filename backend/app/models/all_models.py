import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Float, JSON, Enum
from sqlalchemy.orm import relationship
from app.db.database import Base
from typing import Any

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="student") # admin, instructor, student
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    question_banks = relationship("QuestionBank", back_populates="owner")
    assessments = relationship("Assessment", back_populates="creator")
    attempts = relationship("Attempt", back_populates="user")

class QuestionBank(Base):
    __tablename__ = "question_banks"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    tags = Column(JSON, default=list) # List of strings
    owner_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    owner = relationship("User", back_populates="question_banks")
    questions = relationship("Question", back_populates="bank", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    bank_id = Column(String, ForeignKey("question_banks.id"))
    type = Column(String, nullable=False) # single_choice, multiple_choice, etc.
    title = Column(String, nullable=False)
    body = Column(String, nullable=True)
    difficulty = Column(String, default="medium")
    points = Column(Integer, default=10)
    options = Column(JSON, default=list) # List of dicts
    correct_answer = Column(JSON, nullable=True) # string or list of strings
    explanation = Column(String, nullable=True)
    hint = Column(String, nullable=True)
    tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    bank = relationship("QuestionBank", back_populates="questions")

class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="draft") # draft, published, archived
    creator_id = Column(String, ForeignKey("users.id"))
    sections = Column(JSON, default=list) # List of dicts describing structure
    settings = Column(JSON, default=dict)
    tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    creator = relationship("User", back_populates="assessments")
    attempts = relationship("Attempt", back_populates="assessment")

class Attempt(Base):
    __tablename__ = "attempts"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    assessment_id = Column(String, ForeignKey("assessments.id"))
    user_id = Column(String, ForeignKey("users.id"))
    status = Column(String, default="in_progress") # in_progress, submitted, graded
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    time_spent_seconds = Column(Integer, default=0)
    score = Column(Float, nullable=True)
    percentage = Column(Float, nullable=True)
    responses = Column(JSON, default=list) # List of dicts
    
    assessment = relationship("Assessment", back_populates="attempts")
    user = relationship("User", back_populates="attempts")
    certificate = relationship("Certificate", back_populates="attempt", uselist=False)

class Certificate(Base):
    __tablename__ = "certificates"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    attempt_id = Column(String, ForeignKey("attempts.id"), unique=True)
    verification_code = Column(String, unique=True, index=True)
    issued_at = Column(DateTime, default=datetime.utcnow)
    
    attempt = relationship("Attempt", back_populates="certificate")
