"""
AI-powered answer evaluation and mistake analysis.
Evaluates user answers and provides personalized feedback.
"""
from app.ai.llm_client import gemini_client
from app.ai.prompts.evaluation_prompts import (
    get_mistake_analysis_prompt,
    get_code_evaluation_prompt
)
from app.models.schemas import QuestionType, MistakeType, LearningAction
from typing import Dict, Any, List

class AnswerEvaluator:
    """Evaluates user answers and provides AI-powered feedback"""
    
    def __init__(self):
        self.llm = gemini_client
    
    async def evaluate_answer(
        self,
        question: Dict[str, Any],
        user_answer: Any,
        question_type: QuestionType
    ) -> Dict[str, Any]:
        """
        Main evaluation method.
        
        Args:
            question: The question data
            user_answer: User's submitted answer
            question_type: Type of question
        
        Returns:
            Evaluation result with feedback and recommendations
        """
        
        if question_type == QuestionType.MCQ:
            return await self._evaluate_mcq(question, user_answer)
        elif question_type == QuestionType.SNIPPET:
            return await self._evaluate_snippet(question, user_answer)
        elif question_type == QuestionType.CODING:
            return await self._evaluate_coding(question, user_answer)
        else:
            raise ValueError(f"Unknown question type: {question_type}")
    
    async def _evaluate_mcq(
        self,
        question: Dict[str, Any],
        selected_option_id: str
    ) -> Dict[str, Any]:
        """Evaluate MCQ answer"""
        
        # Find correct option
        correct_option = next(
            (opt for opt in question["options"] if opt["is_correct"]),
            None
        )
        selected_option = next(
            (opt for opt in question["options"] if opt["id"] == selected_option_id),
            None
        )
        
        is_correct = selected_option and selected_option["is_correct"]
        
        # Calculate score and XP
        score = 100 if is_correct else 0
        xp_earned = question.get("xp_reward", 50) if is_correct else 10
        
        # Get AI analysis of the mistake
        prompt = get_mistake_analysis_prompt(
            question=question,
            user_answer=selected_option["text"] if selected_option else "No answer",
            correct_answer=correct_option["text"] if correct_option else "Unknown",
            is_correct=is_correct
        )
        
        ai_analysis = await self.llm.generate_json(prompt)
        
        return {
            "is_correct": is_correct,
            "score": score,
            "xp_earned": xp_earned,
            "mistakes": ai_analysis.get("mistakes", []),
            "recommended_action": ai_analysis.get("recommended_action", "more_practice"),
            "detailed_feedback": ai_analysis.get("detailed_feedback", ""),
            "correct_answer": correct_option["text"] if correct_option else "Unknown"
        }
    
    async def _evaluate_snippet(
        self,
        question: Dict[str, Any],
        selected_option_id: str
    ) -> Dict[str, Any]:
        """Evaluate code snippet question (similar to MCQ)"""
        return await self._evaluate_mcq(question, selected_option_id)
    
    async def _evaluate_coding(
        self,
        question: Dict[str, Any],
        user_code: str
    ) -> Dict[str, Any]:
        """
        Evaluate coding solution.
        Runs test cases and provides code quality feedback.
        """
        from app.services.judge0_service import judge0_service
        
        # Run code against test cases
        test_results = await judge0_service.run_test_cases(
            code=user_code,
            language=question.get("language", "python"),
            test_cases=question.get("test_cases", [])
        )
        
        # Calculate score based on passed tests
        passed_tests = sum(1 for t in test_results if t.get("passed"))
        total_tests = len(test_results)
        score = int((passed_tests / total_tests) * 100) if total_tests > 0 else 0
        
        is_correct = passed_tests == total_tests
        xp_earned = question.get("xp_reward", 150) if is_correct else int(score * 1.5)
        
        # Get AI code review
        prompt = get_code_evaluation_prompt(
            question=question,
            user_code=user_code,
            test_results=test_results
        )
        
        ai_analysis = await self.llm.generate_json(prompt)
        
        return {
            "is_correct": is_correct,
            "score": score,
            "xp_earned": xp_earned,
            "test_results": test_results,
            "passed_tests": passed_tests,
            "total_tests": total_tests,
            "mistakes": ai_analysis.get("mistakes", []),
            "recommended_action": ai_analysis.get("recommended_action", "more_practice"),
            "detailed_feedback": ai_analysis.get("detailed_feedback", ""),
            "code_quality_score": ai_analysis.get("code_quality_score", score),
            "efficiency_notes": ai_analysis.get("efficiency_notes", "")
        }
    
    def calculate_xp_reward(
        self,
        base_xp: int,
        difficulty: str,
        time_taken: int,
        is_correct: bool
    ) -> int:
        """
        Calculate XP reward with bonuses.
        
        Bonuses:
        - Speed bonus: Complete quickly
        - Difficulty multiplier
        - Partial credit for incorrect answers
        """
        if not is_correct:
            return int(base_xp * 0.2)  # 20% XP for attempt
        
        # Difficulty multiplier
        multipliers = {
            "beginner": 1.0,
            "intermediate": 1.5,
            "advanced": 2.0,
            "expert": 3.0
        }
        xp = base_xp * multipliers.get(difficulty, 1.0)
        
        # Speed bonus (if completed in under 2 minutes)
        if time_taken < 120:
            xp *= 1.2
        
        return int(xp)

# Global evaluator instance
answer_evaluator = AnswerEvaluator()
