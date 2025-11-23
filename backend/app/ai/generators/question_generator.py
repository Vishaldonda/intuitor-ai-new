"""
AI-powered question generation service.
Generates personalized questions based on user progress and difficulty.
"""
from app.ai.llm_client import gemini_client
from app.ai.prompts.question_prompts import (
    get_mcq_generation_prompt,
    get_snippet_generation_prompt,
    get_coding_generation_prompt
)
from app.models.schemas import QuestionType, DifficultyLevel
from typing import Dict, Any

class QuestionGenerator:
    """Generates questions using AI based on user context"""
    
    def __init__(self):
        self.llm = gemini_client
    
    async def generate_question(
        self,
        topic: str,
        subtopic: str,
        difficulty: DifficultyLevel,
        question_type: QuestionType,
        user_context: Dict[str, Any],
        language: str = "python"
    ) -> Dict[str, Any]:
        """
        Main method to generate a question.
        
        Args:
            topic: Topic name (e.g., "Arrays", "HTML Basics")
            subtopic: Subtopic name (e.g., "Two Pointers", "Semantic Tags")
            difficulty: Difficulty level
            question_type: MCQ, snippet, or coding
            user_context: User's learning history and performance
            language: Programming language for code questions
        
        Returns:
            Generated question as dictionary
        """
        
        # Select appropriate prompt based on question type
        if question_type == QuestionType.MCQ:
            prompt = get_mcq_generation_prompt(
                topic, subtopic, difficulty.value, user_context
            )
        elif question_type == QuestionType.SNIPPET:
            prompt = get_snippet_generation_prompt(
                topic, subtopic, difficulty.value, language
            )
        elif question_type == QuestionType.CODING:
            prompt = get_coding_generation_prompt(
                topic, subtopic, difficulty.value, language
            )
        else:
            raise ValueError(f"Unknown question type: {question_type}")
        
        # Generate question using LLM
        question_data = await self.llm.generate_json(prompt, temperature=0.8)
        
        # Add metadata
        question_data["topic"] = topic
        question_data["subtopic"] = subtopic
        question_data["difficulty"] = difficulty.value
        question_data["question_type"] = question_type.value
        question_data["language"] = language if question_type != QuestionType.MCQ else None
        
        return question_data
    
    async def generate_adaptive_question(
        self,
        user_id: str,
        topic_id: str,
        user_progress: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate question with adaptive difficulty.
        Adjusts difficulty based on user's recent performance.
        
        Args:
            user_id: User identifier
            topic_id: Topic identifier
            user_progress: User's progress data for this topic
        
        Returns:
            Generated question
        """
        
        # Determine appropriate difficulty based on performance
        accuracy = user_progress.get("accuracy", 0)
        current_difficulty = user_progress.get("current_difficulty", "beginner")
        questions_attempted = user_progress.get("questions_attempted", 0)
        
        # Adaptive difficulty logic
        if questions_attempted < 3:
            # Start with beginner for new topics
            difficulty = DifficultyLevel.BEGINNER
        elif accuracy >= 80 and questions_attempted >= 5:
            # High accuracy → increase difficulty
            difficulty = self._increase_difficulty(current_difficulty)
        elif accuracy < 50:
            # Low accuracy → decrease difficulty
            difficulty = self._decrease_difficulty(current_difficulty)
        else:
            # Maintain current difficulty
            difficulty = DifficultyLevel(current_difficulty)
        
        # Determine question type (mix of MCQ, snippet, coding)
        question_type = self._select_question_type(questions_attempted)
        
        # Generate question
        return await self.generate_question(
            topic=user_progress.get("topic_name", "Programming"),
            subtopic=user_progress.get("subtopic_name", "Basics"),
            difficulty=difficulty,
            question_type=question_type,
            user_context={
                "questions_attempted": questions_attempted,
                "accuracy": accuracy,
                "weak_areas": user_progress.get("weak_areas", [])
            }
        )
    
    def _increase_difficulty(self, current: str) -> DifficultyLevel:
        """Move to next difficulty level"""
        levels = [
            DifficultyLevel.BEGINNER,
            DifficultyLevel.INTERMEDIATE,
            DifficultyLevel.ADVANCED,
            DifficultyLevel.EXPERT
        ]
        try:
            current_idx = levels.index(DifficultyLevel(current))
            return levels[min(current_idx + 1, len(levels) - 1)]
        except ValueError:
            return DifficultyLevel.BEGINNER
    
    def _decrease_difficulty(self, current: str) -> DifficultyLevel:
        """Move to previous difficulty level"""
        levels = [
            DifficultyLevel.BEGINNER,
            DifficultyLevel.INTERMEDIATE,
            DifficultyLevel.ADVANCED,
            DifficultyLevel.EXPERT
        ]
        try:
            current_idx = levels.index(DifficultyLevel(current))
            return levels[max(current_idx - 1, 0)]
        except ValueError:
            return DifficultyLevel.BEGINNER
    
    def _select_question_type(self, questions_attempted: int) -> QuestionType:
        """Select question type based on progression"""
        # Start with MCQ, gradually introduce snippets and coding
        if questions_attempted < 3:
            return QuestionType.MCQ
        elif questions_attempted < 6:
            return QuestionType.SNIPPET if questions_attempted % 2 == 0 else QuestionType.MCQ
        else:
            # Mix all types
            cycle = questions_attempted % 3
            return [QuestionType.MCQ, QuestionType.SNIPPET, QuestionType.CODING][cycle]

# Global question generator instance
question_generator = QuestionGenerator()
