"""
Course and curriculum API endpoints.
Provides course catalog, topics, and subtopics.
"""
from fastapi import APIRouter, HTTPException
from app.db.supabase_client import supabase_client
from app.models.schemas import Course
from typing import List

router = APIRouter()

@router.get("/", response_model=List[Course])
async def get_courses():
    """
    Get all available courses.
    """
    try:
        courses = await supabase_client.get_courses()
        return courses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{course_id}")
async def get_course(course_id: str):
    """
    Get specific course with topics.
    """
    try:
        course = await supabase_client.client.table("courses").select("*").eq("id", course_id).single().execute()
        
        if not course.data:
            raise HTTPException(status_code=404, detail="Course not found")
        
        topics = await supabase_client.get_topics(course_id)
        
        return {
            "course": course.data,
            "topics": topics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
