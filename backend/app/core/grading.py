from typing import Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models import all_models

def grade_attempt(db: Session, attempt: all_models.Attempt, assessment: all_models.Assessment) -> Tuple[float, float, bool]:
    """
    Grades an attempt based on the assessment's questions.
    Returns: (score, percentage, passed)
    """
    total_score = 0.0
    max_score = 0.0
    
    # Pre-fetch all questions for the assessment
    # The assessment structure stores questions in sections:
    # assessment.sections = [{ "questions": [{"id": "q1", "points": 10}, ...] }]
    question_ids = []
    points_map = {}
    if assessment.sections:
        for section in assessment.sections:
            for q in section.get("questions", []):
                q_id = q.get("id")
                question_ids.append(q_id)
                points_map[q_id] = q.get("points", 0)
                max_score += points_map[q_id]
                
    questions = db.query(all_models.Question).filter(all_models.Question.id.in_(question_ids)).all()
    questions_map = {q.id: q for q in questions}
    
    for q_id, q_points in points_map.items():
        question = questions_map.get(q_id)
        if not question:
            continue
            
        user_answer = attempt.answers.get(q_id)
        if user_answer is None:
            continue
            
        if question.type in ["single_choice", "true_false"]:
            if str(user_answer) == str(question.correct_answer):
                total_score += q_points
                
        elif question.type == "multiple_choice":
            # Correct answer should be a list, e.g., ["o1", "o2"]
            # User answer should be a list as well
            if isinstance(user_answer, list) and isinstance(question.correct_answer, list):
                if set(map(str, user_answer)) == set(map(str, question.correct_answer)):
                    total_score += q_points
                    
        # Future enhancement: partial grading for multiple_choice, and essay grading

    percentage = (total_score / max_score * 100) if max_score > 0 else 0
    passing_score = assessment.settings.get("passing_score", 70)
    passed = percentage >= passing_score
    
    return total_score, percentage, passed
