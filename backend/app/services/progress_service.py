"""
User progress tracking and adaptive learning service.
Manages XP, levels, difficulty progression, and learning recommendations.
"""
from app.db.supabase_client import supabase_client
from app.models.schemas import LearningAction, DifficultyLevel
from typing import Dict, Any, Optional
from datetime import datetime, timedelta

class ProgressService:
    """Manages user learning progression and adaptive difficulty"""
    
    def __init__(self):
        self.db = supabase_client
    
    async def update_progress(
        self,
        user_id: str,
        topic_id: str,
        question_id: str,
        is_correct: bool,
        xp_earned: int,
        time_taken: int,
        mistakes: list,
        recommended_action: str
    ) -> Dict[str, Any]:
        """
        Update user progress after question attempt.
        
        This is the core method that:
        1. Updates user XP and checks for level up
        2. Updates topic-specific progress
        3. Adjusts difficulty based on performance
        4. Tracks mistake patterns
        5. Updates streak
        
        Args:
            user_id: User identifier
            topic_id: Topic identifier
            question_id: Question identifier
            is_correct: Whether answer was correct
            xp_earned: XP earned from this question
            time_taken: Time taken in seconds
            mistakes: List of mistakes made
            recommended_action: AI recommendation
        
        Returns:
            Updated progress data with level up info if applicable
        """
        
        # 1. Update user XP and level
        user_profile = await self.db.update_user_xp(user_id, xp_earned)
        level_up_info = None
        
        # Check if user leveled up
        old_level = user_profile.get("level", 1) - 1
        new_level = user_profile.get("level", 1)
        if new_level > old_level:
            level_up_info = self._create_level_up_info(new_level)
        
        # 2. Update streak
        await self._update_streak(user_id)
        
        # 3. Get or create topic progress
        topic_progress = await self.db.get_user_progress(user_id, topic_id)
        
        if not topic_progress:
            # Create new progress entry
            topic_progress = {
                "user_id": user_id,
                "topic_id": topic_id,
                "current_difficulty": DifficultyLevel.BEGINNER.value,
                "questions_attempted": 0,
                "questions_correct": 0,
                "accuracy": 0.0,
                "total_xp_earned": 0,
                "mastery_level": 0,
                "last_activity": datetime.utcnow().isoformat()
            }
        
        # 4. Update topic progress stats
        topic_progress["questions_attempted"] += 1
        if is_correct:
            topic_progress["questions_correct"] += 1
        
        topic_progress["accuracy"] = (
            topic_progress["questions_correct"] / topic_progress["questions_attempted"]
        ) * 100
        topic_progress["total_xp_earned"] += xp_earned
        topic_progress["last_activity"] = datetime.utcnow().isoformat()
        
        # 5. Adjust difficulty based on performance
        topic_progress["current_difficulty"] = self._adjust_difficulty(
            current_difficulty=topic_progress["current_difficulty"],
            accuracy=topic_progress["accuracy"],
            questions_attempted=topic_progress["questions_attempted"],
            recommended_action=recommended_action
        )
        
        # 6. Calculate mastery level (0-100)
        topic_progress["mastery_level"] = self._calculate_mastery(
            accuracy=topic_progress["accuracy"],
            questions_attempted=topic_progress["questions_attempted"],
            current_difficulty=topic_progress["current_difficulty"]
        )
        
        # 7. Save updated progress
        updated_progress = await self.db.update_progress(topic_progress)
        
        # 8. Save question attempt record
        await self.db.save_attempt({
            "user_id": user_id,
            "question_id": question_id,
            "topic_id": topic_id,
            "is_correct": is_correct,
            "xp_earned": xp_earned,
            "time_taken": time_taken,
            "mistakes": mistakes,
            "recommended_action": recommended_action,
            "attempted_at": datetime.utcnow().isoformat()
        })
        
        return {
            "progress": updated_progress,
            "user_profile": user_profile,
            "level_up": level_up_info,
            "xp_earned": xp_earned
        }
    
    def _adjust_difficulty(
        self,
        current_difficulty: str,
        accuracy: float,
        questions_attempted: int,
        recommended_action: str
    ) -> str:
        """
        Adaptive difficulty adjustment logic.
        
        Rules:
        - Need 5+ questions before increasing difficulty
        - 80%+ accuracy → increase difficulty
        - <50% accuracy → decrease difficulty
        - AI recommendation overrides if strong signal
        """
        
        # Not enough data yet
        if questions_attempted < 5:
            return current_difficulty
        
        # AI strongly recommends next level
        if recommended_action == LearningAction.NEXT_DIFFICULTY.value:
            if accuracy >= 75:
                return self._increase_difficulty(current_difficulty)
        
        # AI recommends revision (decrease difficulty)
        if recommended_action == LearningAction.REVISION.value:
            return self._decrease_difficulty(current_difficulty)
        
        # Automatic adjustment based on accuracy
        if accuracy >= 80 and questions_attempted >= 10:
            return self._increase_difficulty(current_difficulty)
        elif accuracy < 50:
            return self._decrease_difficulty(current_difficulty)
        
        return current_difficulty
    
    def _increase_difficulty(self, current: str) -> str:
        """Move to next difficulty level"""
        levels = ["beginner", "intermediate", "advanced", "expert"]
        try:
            idx = levels.index(current)
            return levels[min(idx + 1, len(levels) - 1)]
        except ValueError:
            return "beginner"
    
    def _decrease_difficulty(self, current: str) -> str:
        """Move to previous difficulty level"""
        levels = ["beginner", "intermediate", "advanced", "expert"]
        try:
            idx = levels.index(current)
            return levels[max(idx - 1, 0)]
        except ValueError:
            return "beginner"
    
    def _calculate_mastery(
        self,
        accuracy: float,
        questions_attempted: int,
        current_difficulty: str
    ) -> int:
        """
        Calculate mastery level (0-100).
        
        Factors:
        - Accuracy (40%)
        - Questions attempted (30%)
        - Difficulty level (30%)
        """
        
        # Accuracy component (0-40)
        accuracy_score = (accuracy / 100) * 40
        
        # Volume component (0-30, caps at 50 questions)
        volume_score = min(questions_attempted / 50, 1.0) * 30
        
        # Difficulty component (0-30)
        difficulty_scores = {
            "beginner": 10,
            "intermediate": 20,
            "advanced": 25,
            "expert": 30
        }
        difficulty_score = difficulty_scores.get(current_difficulty, 10)
        
        mastery = int(accuracy_score + volume_score + difficulty_score)
        return min(mastery, 100)
    
    async def _update_streak(self, user_id: str) -> int:
        """
        Update user's daily streak.
        Increments if user practiced today, resets if missed a day.
        """
        profile = await self.db.get_user_profile(user_id)
        last_activity = profile.get("last_activity_date")
        current_streak = profile.get("streak", 0)
        
        today = datetime.utcnow().date()
        
        if not last_activity:
            # First activity
            new_streak = 1
        else:
            last_date = datetime.fromisoformat(last_activity).date()
            days_diff = (today - last_date).days
            
            if days_diff == 0:
                # Already practiced today
                new_streak = current_streak
            elif days_diff == 1:
                # Consecutive day
                new_streak = current_streak + 1
            else:
                # Streak broken
                new_streak = 1
        
        # Update streak in database
        await self.db.client.table("user_profiles").update({
            "streak": new_streak,
            "last_activity_date": today.isoformat()
        }).eq("id", user_id).execute()
        
        return new_streak
    
    def _create_level_up_info(self, new_level: int) -> Dict[str, Any]:
        """Create level up celebration data"""
        
        # XP required for next level
        xp_required = (new_level + 1) ** 2 * 100
        
        # Rewards based on level milestones
        rewards = []
        if new_level % 5 == 0:
            rewards.append(f"🎉 Milestone Badge: Level {new_level}")
        if new_level == 10:
            rewards.append("🔓 Unlocked: Advanced Topics")
        if new_level == 20:
            rewards.append("🔓 Unlocked: Expert Challenges")
        
        return {
            "new_level": new_level,
            "xp_required": xp_required,
            "rewards": rewards,
            "message": f"🎊 Congratulations! You've reached Level {new_level}!"
        }

# Global progress service instance
progress_service = ProgressService()
