"""
Pydantic models for request/response validation.
These define the shape of data flowing through the API.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# ============= ENUMS =============

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class QuestionType(str, Enum):
    MCQ = "mcq"
    SNIPPET = "snippet"
    CODING = "coding"

class MistakeType(str, Enum):
    MINOR = "minor"
    MAJOR = "major"
    CONCEPTUAL = "conceptual"

class LearningAction(str, Enum):
    REVISION = "revision"
    DETAILED_EXPLANATION = "detailed_explanation"
    MORE_PRACTICE = "more_practice"
    NEXT_DIFFICULTY = "next_difficulty"

# ============= AUTH MODELS =============

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    level: int = 1
    xp: int = 0
    streak: int = 0
    created_at: datetime

# ============= COURSE MODELS =============

class Course(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    color: str
    total_topics: int
    estimated_hours: int

class Topic(BaseModel):
    id: str
    course_id: str
    name: str
    description: str
    order: int
    difficulty: DifficultyLevel
    estimated_minutes: int

class Subtopic(BaseModel):
    id: str
    topic_id: str
    name: str
    description: str
    order: int

# ============= QUESTION MODELS =============

class QuestionRequest(BaseModel):
    """Request to generate a new question"""
    user_id: str
    topic_id: str
    subtopic_id: Optional[str] = None
    difficulty: DifficultyLevel
    question_type: QuestionType

class MCQOption(BaseModel):
    id: str
    text: str
    is_correct: bool

class Question(BaseModel):
    id: str
    topic_id: str
    subtopic_id: Optional[str]
    question_type: QuestionType
    difficulty: DifficultyLevel
    question_text: str
    
    # MCQ specific
    options: Optional[List[MCQOption]] = None
    
    # Snippet specific
    code_snippet: Optional[str] = None
    language: Optional[str] = None
    
    # Coding specific
    test_cases: Optional[List[Dict[str, Any]]] = None
    starter_code: Optional[str] = None
    
    explanation: str
    hints: List[str] = []
    xp_reward: int

# ============= EVALUATION MODELS =============

class AnswerSubmission(BaseModel):
    """User's answer submission"""
    question_id: str
    user_id: str
    
    # For MCQ
    selected_option_id: Optional[str] = None
    
    # For Snippet
    snippet_answer: Optional[str] = None
    
    # For Coding
    code_solution: Optional[str] = None
    language: Optional[str] = None

class MistakeAnalysis(BaseModel):
    mistake_type: MistakeType
    description: str
    concept_gap: str
    suggestion: str

class EvaluationResult(BaseModel):
    is_correct: bool
    score: int  # 0-100
    xp_earned: int
    time_taken: int  # seconds
    mistakes: List[MistakeAnalysis]
    recommended_action: LearningAction
    detailed_feedback: str
    correct_answer: str

# ============= PROGRESS MODELS =============

class UserProgress(BaseModel):
    user_id: str
    topic_id: str
    current_difficulty: DifficultyLevel
    questions_attempted: int
    questions_correct: int
    accuracy: float
    total_xp_earned: int
    last_activity: datetime
    mastery_level: int  # 0-100

class ProgressUpdate(BaseModel):
    user_id: str
    topic_id: str
    question_id: str
    is_correct: bool
    xp_earned: int
    time_taken: int

class LevelUp(BaseModel):
    new_level: int
    xp_required: int
    rewards: List[str]
    message: str
