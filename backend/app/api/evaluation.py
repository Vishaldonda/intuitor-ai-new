"""
Answer evaluation API endpoints.
Handles answer submission, AI evaluation, and feedback generation.
"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import AnswerSubmission, EvaluationResult
from app.ai.evaluators.answer_evaluator import answer_evaluator
from app.services.progress_service import progress_service
from app.db.supabase_client import supabase_client
from datetime import datetime

router = APIRouter()

@router.post("/submit", response_model=dict)
async def submit_answer(submission: AnswerSubmission):
    """
    Submit answer for evaluation.
    
    This is the main evaluation flow:
    1. Get the question
    2. Evaluate answer using AI
    3. Update user progress
    4. Return evaluation result with feedback
    """
    try:
        # 1. Get question
        question = await supabase_client.get_question(submission.question_id)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        
        # 2. Determine user's answer based on question type
        question_type = question.get("question_type")
        
        if question_type == "mcq" or question_type == "snippet":
            user_answer = submission.selected_option_id
        elif question_type == "coding":
            user_answer = submission.code_solution
        else:
            raise HTTPException(status_code=400, detail="Invalid question type")
        
        # 3. Evaluate answer using AI
        evaluation = await answer_evaluator.evaluate_answer(
            question=question,
            user_answer=user_answer,
            question_type=question_type
        )
        
        # 4. Update user progress
        progress_update = await progress_service.update_progress(
            user_id=submission.user_id,
            topic_id=question.get("topic_id"),
            question_id=submission.question_id,
            is_correct=evaluation["is_correct"],
            xp_earned=evaluation["xp_earned"],
            time_taken=0,  # TODO: Track time on frontend
            mistakes=evaluation.get("mistakes", []),
            recommended_action=evaluation.get("recommended_action", "more_practice")
        )
        
        # 5. Return comprehensive result
        return {
            "evaluation": evaluation,
            "progress": progress_update["progress"],
            "user_profile": progress_update["user_profile"],
            "level_up": progress_update.get("level_up"),
            "xp_earned": evaluation["xp_earned"]
        }
    
    except Exception as e:
        print(f"Error evaluating answer: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/hint/{question_id}")
async def get_hint(question_id: str, hint_index: int):
    """
    Get a hint for a question.
    Hints are progressive (each one reveals more).
    """
    question = await supabase_client.get_question(question_id)
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    hints = question.get("hints", [])
    
    if hint_index >= len(hints):
        raise HTTPException(status_code=400, detail="No more hints available")
    
    return {
        "hint": hints[hint_index],
        "hints_remaining": len(hints) - hint_index - 1
    }
