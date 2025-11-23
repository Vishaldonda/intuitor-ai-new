"""
Authentication API endpoints.
Handles user registration, login, and token management.
"""
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import UserRegister, UserLogin, Token, UserProfile
from app.db.supabase_client import supabase_client
from typing import Dict
import time

router = APIRouter()

@router.get("/test")
def test_connection():
    """Test if Supabase is connected"""
    try:
        # Try to query a table
        response = supabase_client.client.table("courses").select("*").limit(1).execute()
        return {
            "status": "connected",
            "supabase_url": supabase_client.client.supabase_url,
            "can_query": True
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

@router.post("/register", response_model=Dict)
def register(user_data: UserRegister):
    """
    Register a new user.
    
    Creates user account in Supabase Auth and initializes user profile.
    Profile is automatically created by database trigger.
    """
    try:
        print(f"Registration attempt for: {user_data.email}")
        
        # Create auth user using admin client (bypasses RLS)
        auth_response = supabase_client.admin_client.auth.admin.create_user({
            "email": user_data.email,
            "password": user_data.password,
            "email_confirm": True,  # Auto-confirm email for development
            "user_metadata": {
                "full_name": user_data.full_name
            }
        })
        
        print(f"Auth response: {auth_response}")
        
        if not auth_response.user:
            raise HTTPException(
                status_code=400, 
                detail="Registration failed - no user returned from Supabase"
            )
        
        # Profile is automatically created by database trigger
        # Wait briefly for trigger to complete
        time.sleep(0.3)
        
        # Fetch the created profile to return to client
        try:
            profile_response = supabase_client.admin_client.table("user_profiles")\
                .select("*")\
                .eq("id", auth_response.user.id)\
                .single()\
                .execute()
            
            profile_data = profile_response.data if profile_response.data else None
        except Exception as profile_error:
            print(f"Warning: Could not fetch profile: {profile_error}")
            profile_data = None
        
        return {
            "message": "Registration successful",
            "user": {
                "id": auth_response.user.id,
                "email": auth_response.user.email,
                "full_name": user_data.full_name
            },
            "profile": profile_data
        }
    
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_detail = f"{str(e)}\n{traceback.format_exc()}"
        print(f"Registration error: {error_detail}")
        
        # Check for common errors
        if "already registered" in str(e).lower() or "already exists" in str(e).lower():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=Token)
def login(credentials: UserLogin):
    """
    Authenticate user and return access token.
    """
    try:
        auth_response = supabase_client.client.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return Token(
            access_token=auth_response.session.access_token,
            token_type="bearer"
        )
    
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

@router.get("/me", response_model=UserProfile)
def get_current_user(access_token: str):
    """
    Get current user profile from access token.
    """
    try:
        user_response = supabase_client.client.auth.get_user(access_token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        profile_response = supabase_client.client.table("user_profiles")\
            .select("*")\
            .eq("id", user_response.user.id)\
            .single()\
            .execute()
        
        if not profile_response.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return profile_response.data
    
    except Exception as e:
        print(f"Get user error: {e}")
        raise HTTPException(status_code=401, detail="Unauthorized")

@router.post("/logout")
def logout():
    """
    Logout current user and invalidate session.
    """
    try:
        supabase_client.client.auth.sign_out()
        return {"message": "Logout successful"}
    except Exception as e:
        print(f"Logout error: {e}")
        raise HTTPException(status_code=500, detail="Logout failed")

@router.post("/refresh")
def refresh_token(refresh_token: str):
    """
    Refresh access token using refresh token.
    """
    try:
        auth_response = supabase_client.client.auth.refresh_session(refresh_token)
        
        if not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        return Token(
            access_token=auth_response.session.access_token,
            token_type="bearer"
        )
    except Exception as e:
        print(f"Refresh token error: {e}")
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@router.post("/reset-password")
def reset_password(email: str):
    """
    Send password reset email to user.
    """
    try:
        supabase_client.client.auth.reset_password_for_email(
            email,
            {"redirect_to": "http://localhost:3000/reset-password"}
        )
        # Don't reveal if email exists or not for security
        return {"message": "If the email exists, a reset link has been sent"}
    except Exception as e:
        print(f"Password reset error: {e}")
        # Still return success to avoid email enumeration
        return {"message": "If the email exists, a reset link has been sent"}

@router.patch("/profile")
def update_profile(user_id: str, updates: Dict):
    """
    Update user profile fields.
    Requires user_id from authenticated session.
    """
    try:
        # Update profile using admin client to bypass RLS if needed
        # In production, you should verify the user_id matches the authenticated user
        profile_response = supabase_client.admin_client.table("user_profiles")\
            .update(updates)\
            .eq("id", user_id)\
            .execute()
        
        if not profile_response.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return {
            "message": "Profile updated successfully",
            "profile": profile_response.data[0]
        }
    
    except Exception as e:
        print(f"Profile update error: {e}")
        raise HTTPException(status_code=500, detail="Profile update failed")