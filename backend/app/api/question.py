"""
Question generation API endpoints.
Handles AI-powered question generation with adaptive difficulty.
"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import QuestionRequest, Question
from app.ai.generators.question_generator import question_generator
from app.db.supabase_client import supabase_client
from typing import Dict

router = APIRouter()

@router.post("/generate", response_model=Question)
async def generate_question(request: QuestionRequest):
    """
    Generate a new question using AI.
    
    This endpoint:
    1. Gets user's progress for the topic
    2. Generates personalized question based on performance
    3. Saves question to database
    4. Returns question to frontend
    """
    try:
        # Get user's progress for this topic
        user_progress = await supabase_client.get_user_progress(
            request.user_id,
            request.topic_id
        )
        
        # If no progress exists, create default context
        if not user_progress:
            user_progress = {
                "current_difficulty": request.difficulty.value,
                "questions_attempted": 0,
                "accuracy": 0,
                "topic_name": "Programming",
                "subtopic_name": "Basics"
            }
        
        # Get topic details
        topic = await supabase_client.client.table("topics").select("*").eq("id", request.topic_id).single().execute()
        
        if request.subtopic_id:
            subtopic = await supabase_client.client.table("subtopics").select("*").eq("id", request.subtopic_id).single().execute()
            subtopic_name = subtopic.data.get("name", "General")
        else:
            subtopic_name = "General"
        
        # Generate question using AI
        question_data = await question_generator.generate_question(
            topic=topic.data.get("name", "Programming"),
            subtopic=subtopic_name,
            difficulty=request.difficulty,
            question_type=request.question_type,
            user_context=user_progress,
            language="python"
        )
        
        # Save to database
        question_data["user_id"] = request.user_id
        question_data["topic_id"] = request.topic_id
        question_data["subtopic_id"] = request.subtopic_id
        
        saved_question = await supabase_client.save_question(question_data)
        
        return saved_question
    
    except Exception as e:
        print(f"Error generating question: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate question: {str(e)}")

@router.post("/adaptive", response_model=Question)
async def generate_adaptive_question(user_id: str, topic_id: str):
    """
    Generate question with adaptive difficulty.
    
    Automatically selects:
    - Appropriate difficulty based on performance
    - Question type (MCQ, snippet, coding)
    - Personalized content
    """
    try:
        # Get user progress
        user_progress = await supabase_client.get_user_progress(user_id, topic_id)
        
        if not user_progress:
            # Initialize progress for new topic
            user_progress = {
                "user_id": user_id,
                "topic_id": topic_id,
                "current_difficulty": "beginner",
                "questions_attempted": 0,
                "accuracy": 0,
                "topic_name": "Programming"
            }
        
        # Generate adaptive question
        question_data = await question_generator.generate_adaptive_question(
            user_id=user_id,
            topic_id=topic_id,
            user_progress=user_progress
        )
        
        # Save to database
        question_data["user_id"] = user_id
        question_data["topic_id"] = topic_id
        
        saved_question = await supabase_client.save_question(question_data)
        
        return saved_question
    
    except Exception as e:
        print(f"Error generating adaptive question: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{question_id}", response_model=Question)
async def get_question(question_id: str):
    """Get a specific question by ID"""
    question = await supabase_client.get_question(question_id)
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return question
