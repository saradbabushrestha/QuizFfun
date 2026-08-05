import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.models import all_models
from app.core.security import get_password_hash

def init_db(db: Session):
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Check if we already have users
    if db.query(all_models.User).first():
        print("Database already seeded.")
        return

    print("Seeding database...")
    
    # Create Demo User
    user = all_models.User(
        id="u1",
        email="demo@quizforge.com",
        name="Demo Admin",
        role="admin",
        hashed_password=get_password_hash("password123")
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create Question Bank
    bank = all_models.QuestionBank(
        id="qb1",
        name="JavaScript Fundamentals",
        description="Core JavaScript concepts for beginners.",
        tags=["programming", "javascript", "web"],
        owner_id=user.id
    )
    db.add(bank)
    db.commit()
    
    # Create Questions
    q1 = all_models.Question(
        id="q1",
        bank_id=bank.id,
        type="single_choice",
        title="What is closure?",
        body="Which of the following best describes a closure in JavaScript?",
        difficulty="medium",
        points=10,
        options=[
            {"id": "o1", "text": "A function bundled together with references to its lexical environment", "order": 0},
            {"id": "o2", "text": "A way to close a browser window", "order": 1},
            {"id": "o3", "text": "A block scope variable", "order": 2},
            {"id": "o4", "text": "A method to end a loop", "order": 3}
        ],
        correct_answer="o1",
        explanation="A closure gives you access to an outer function's scope from an inner function.",
        tags=["javascript", "concepts"]
    )
    
    q2 = all_models.Question(
        id="q2",
        bank_id=bank.id,
        type="multiple_choice",
        title="Which are array methods?",
        body="Select all the built-in array methods in JavaScript.",
        difficulty="easy",
        points=10,
        options=[
            {"id": "o1", "text": "map()", "order": 0},
            {"id": "o2", "text": "filter()", "order": 1},
            {"id": "o3", "text": "parse()", "order": 2},
            {"id": "o4", "text": "reduce()", "order": 3}
        ],
        correct_answer=["o1", "o2", "o4"],
        explanation="parse() is a method of JSON, not Array.",
        tags=["javascript", "arrays"]
    )
    
    db.add_all([q1, q2])
    db.commit()
    
    # Create Assessment
    assessment = all_models.Assessment(
        id="a1",
        title="JavaScript Mastery Test",
        description="Test your knowledge of core JavaScript concepts.",
        status="published",
        creator_id=user.id,
        sections=[
            {
                "id": "s1",
                "title": "Core Concepts",
                "questions": [
                    {"id": "q1", "points": 10},
                    {"id": "q2", "points": 10}
                ]
            }
        ],
        settings={
            "time_limit_minutes": 30,
            "max_attempts": 3,
            "passing_score": 70,
            "shuffle_questions": True
        },
        tags=["javascript", "frontend"]
    )
    db.add(assessment)
    db.commit()
    
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
