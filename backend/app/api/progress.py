"""
Progress tracking API endpoints.
Provides user progress, statistics, and learning analytics.
"""
from fastapi import APIRouter, HTTPException
from app.db.supabase_client import supabase_client
from typing import List, Dict

router = APIRouter()

@router.get("/user/{user_id}")
async def get_user_progress(user_id: str):
    """
    Get comprehensive user progress across all topics.
    """
    try:
        # Get user profile
        profile = await supabase_client.get_user_profile(user_id)
        
        # Get progress for all topics
        all_progress = await supabase_client.client.table("user_progress").select("*").eq("user_id", user_id).execute()
        
        # Get recent attempts
        recent_attempts = await supabase_client.client.table("question_attempts").select("*").eq("user_id", user_id).order("attempted_at", desc=True).limit(10).execute()
        
        return {
            "profile": profile,
            "topic_progress": all_progress.data,
            "recent_attempts": recent_attempts.data,
            "total_questions": sum(p.get("questions_attempted", 0) for p in all_progress.data),
            "overall_accuracy": sum(p.get("accuracy", 0) for p in all_progress.data) / len(all_progress.data) if all_progress.data else 0
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/topic/{user_id}/{topic_id}")
async def get_topic_progress(user_id: str, topic_id: str):
    """
    Get detailed progress for a specific topic.
    """
    try:
        progress = await supabase_client.get_user_progress(user_id, topic_id)
        
        if not progress:
            return {
                "message": "No progress yet for this topic",
                "progress": None
            }
        
        # Get attempts for this topic
        attempts = await supabase_client.client.table("question_attempts").select("*").eq("user_id", user_id).eq("topic_id", topic_id).order("attempted_at", desc=True).execute()
        
        return {
            "progress": progress,
            "attempts": attempts.data,
            "total_attempts": len(attempts.data)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """
    Get top users by XP (leaderboard).
    """
    try:
        leaderboard = await supabase_client.client.table("user_profiles").select("id, full_name, level, xp, streak").order("xp", desc=True).limit(limit).execute()
        
        return {
            "leaderboard": leaderboard.data
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats/{user_id}")
async def get_user_stats(user_id: str):
    """
    Get detailed statistics and analytics for user.
    """
    try:
        # Get all attempts
        attempts = await supabase_client.client.table("question_attempts").select("*").eq("user_id", user_id).execute()
        
        # Calculate stats
        total_attempts = len(attempts.data)
        correct_attempts = sum(1 for a in attempts.data if a.get("is_correct"))
        total_xp = sum(a.get("xp_earned", 0) for a in attempts.data)
        
        # Mistake analysis
        all_mistakes = []
        for attempt in attempts.data:
            all_mistakes.extend(attempt.get("mistakes", []))
        
        # Group by mistake type
        mistake_counts = {}
        for mistake in all_mistakes:
            mistake_type = mistake.get("mistake_type", "unknown")
            mistake_counts[mistake_type] = mistake_counts.get(mistake_type, 0) + 1
        
        return {
            "total_attempts": total_attempts,
            "correct_attempts": correct_attempts,
            "accuracy": (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0,
            "total_xp_earned": total_xp,
            "mistake_breakdown": mistake_counts,
            "recent_activity": attempts.data[-7:] if len(attempts.data) >= 7 else attempts.data
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
