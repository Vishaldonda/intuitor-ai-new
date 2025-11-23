"""
Authentication API endpoints.
Handles user registration, login, and token management.
"""
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import UserRegister, UserLogin, Token, UserProfile
from app.db.supabase_client import supabase_client
from typing import Dict

router = APIRouter()

@router.post("/register", response_model=Dict)
async def register(user_data: UserRegister):
    """
    Register a new user.
    
    Creates user account in Supabase Auth and initializes user profile.
    """
    try:
        # Create auth user
        response = await supabase_client.sign_up(
            email=user_data.email,
            password=user_data.password,
            metadata={"full_name": user_data.full_name}
        )
        
        if not response.user:
            raise HTTPException(status_code=400, detail="Registration failed")
        
        # Initialize user profile
        profile_data = {
            "id": response.user.id,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "level": 1,
            "xp": 0,
            "streak": 0
        }
        
        await supabase_client.client.table("user_profiles").insert(profile_data).execute()
        
        return {
            "message": "Registration successful",
            "user": response.user,
            "access_token": response.session.access_token if response.session else None
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """
    Authenticate user and return access token.
    """
    try:
        response = await supabase_client.sign_in(
            email=credentials.email,
            password=credentials.password
        )
        
        if not response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return Token(
            access_token=response.session.access_token,
            token_type="bearer"
        )
    
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@router.get("/me", response_model=UserProfile)
async def get_current_user(access_token: str):
    """
    Get current user profile from access token.
    """
    try:
        user = await supabase_client.get_user(access_token)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        profile = await supabase_client.get_user_profile(user.id)
        return profile
    
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")
