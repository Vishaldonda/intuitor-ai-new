"""
Supabase client initialization and database utilities.
Provides typed access to Supabase database and auth.
"""
from supabase import create_client, Client
from app.core.config import settings
from typing import Optional, Dict, Any, List

class SupabaseClient:
    """Wrapper around Supabase client with helper methods"""
    
    def __init__(self):
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
        self.admin_client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY
        )
    
    # ============= AUTH METHODS =============
    
    async def sign_up(self, email: str, password: str, metadata: Dict[str, Any]) -> Dict:
        """Register a new user"""
        response = self.client.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": metadata
            }
        })
        return response
    
    async def sign_in(self, email: str, password: str) -> Dict:
        """Authenticate user"""
        response = self.client.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return response
    
    async def get_user(self, access_token: str) -> Optional[Dict]:
        """Get user from access token"""
        response = self.client.auth.get_user(access_token)
        return response.user if response else None
    
    # ============= USER PROFILE METHODS =============
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict]:
        """Get user profile with progress stats"""
        response = self.client.table("user_profiles").select("*").eq("id", user_id).single().execute()
        return response.data if response.data else None
    
    async def update_user_xp(self, user_id: str, xp_to_add: int) -> Dict:
        """Add XP to user and check for level up"""
        profile = await self.get_user_profile(user_id)
        new_xp = profile["xp"] + xp_to_add
        new_level = self._calculate_level(new_xp)
        
        response = self.client.table("user_profiles").update({
            "xp": new_xp,
            "level": new_level
        }).eq("id", user_id).execute()
        
        return response.data[0]
    
    def _calculate_level(self, xp: int) -> int:
        """Calculate level based on XP (exponential curve)"""
        # Level formula: level = floor(sqrt(xp / 100))
        import math
        return max(1, math.floor(math.sqrt(xp / 100)))
    
    # ============= COURSE/TOPIC METHODS =============
    
    async def get_courses(self) -> List[Dict]:
        """Get all available courses"""
        response = self.client.table("courses").select("*").execute()
        return response.data
    
    async def get_topics(self, course_id: str) -> List[Dict]:
        """Get topics for a course"""
        response = self.client.table("topics").select("*").eq("course_id", course_id).order("order").execute()
        return response.data
    
    async def get_subtopics(self, topic_id: str) -> List[Dict]:
        """Get subtopics for a topic"""
        response = self.client.table("subtopics").select("*").eq("topic_id", topic_id).order("order").execute()
        return response.data
    
    # ============= QUESTION METHODS =============
    
    async def save_question(self, question_data: Dict) -> Dict:
        """Save generated question to database"""
        response = self.client.table("questions").insert(question_data).execute()
        return response.data[0]
    
    async def get_question(self, question_id: str) -> Optional[Dict]:
        """Get question by ID"""
        response = self.client.table("questions").select("*").eq("id", question_id).single().execute()
        return response.data if response.data else None
    
    # ============= PROGRESS METHODS =============
    
    async def get_user_progress(self, user_id: str, topic_id: str) -> Optional[Dict]:
        """Get user's progress for a specific topic"""
        response = self.client.table("user_progress").select("*").eq("user_id", user_id).eq("topic_id", topic_id).single().execute()
        return response.data if response.data else None
    
    async def update_progress(self, progress_data: Dict) -> Dict:
        """Update user progress after question attempt"""
        response = self.client.table("user_progress").upsert(progress_data).execute()
        return response.data[0]
    
    async def save_attempt(self, attempt_data: Dict) -> Dict:
        """Save question attempt with evaluation"""
        response = self.client.table("question_attempts").insert(attempt_data).execute()
        return response.data[0]

# Global Supabase client instance
supabase_client = SupabaseClient()
