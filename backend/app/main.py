"""
Main FastAPI application entry point.
Configures routers, middleware, and startup/shutdown events.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, course, topic, question, evaluation, progress

# Initialize FastAPI app
app = FastAPI(
    title="SkillForge LMS API",
    description="AI-Powered Skill-Based Learning Management System",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration - Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(course.router, prefix="/api/courses", tags=["Courses"])
app.include_router(topic.router, prefix="/api/topics", tags=["Topics"])
app.include_router(question.router, prefix="/api/questions", tags=["Questions"])
app.include_router(evaluation.router, prefix="/api/evaluation", tags=["Evaluation"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "SkillForge LMS API",
        "version": "1.0.0"
    }

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 SkillForge LMS API starting up...")
    # Initialize AI services, database connections, etc.

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("👋 SkillForge LMS API shutting down...")
    # Close connections, cleanup resources
