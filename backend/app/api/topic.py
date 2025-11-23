"""
Topic API endpoints.
Provides topic details and subtopics.
"""
from fastapi import APIRouter, HTTPException
from app.db.supabase_client import supabase_client

router = APIRouter()

@router.get("/{topic_id}")
async def get_topic(topic_id: str):
    """
    Get topic details with subtopics.
    """
    try:
        topic = await supabase_client.client.table("topics").select("*").eq("id", topic_id).single().execute()
        
        if not topic.data:
            raise HTTPException(status_code=404, detail="Topic not found")
        
        subtopics = await supabase_client.get_subtopics(topic_id)
        
        return {
            "topic": topic.data,
            "subtopics": subtopics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/course/{course_id}")
async def get_topics_by_course(course_id: str):
    """
    Get all topics for a course.
    """
    try:
        topics = await supabase_client.get_topics(course_id)
        return {"topics": topics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
