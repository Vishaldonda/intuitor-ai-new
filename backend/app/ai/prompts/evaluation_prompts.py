"""
Prompt templates for AI-powered answer evaluation and mistake analysis.
"""

def get_mistake_analysis_prompt(
    question: dict,
    user_answer: str,
    correct_answer: str,
    is_correct: bool
) -> str:
    """
    Analyze user's mistake and provide personalized feedback.
    """
    
    if is_correct:
        return f"""The user answered correctly. Provide brief positive reinforcement.

Return JSON:
{{
    "mistakes": [],
    "recommended_action": "next_difficulty",
    "detailed_feedback": "Great job! You demonstrated solid understanding of this concept."
}}"""
    
    return f"""You are an expert educator analyzing a student's mistake.

**Question**: {question.get('question_text')}
**Correct Answer**: {correct_answer}
**User's Answer**: {user_answer}

Analyze the mistake and determine:
1. **Mistake Type**: minor (small error), major (fundamental misunderstanding), or conceptual (lacks core concept)
2. **Concept Gap**: What concept does the user not understand?
3. **Recommended Action**:
   - "revision": User needs to review the basics
   - "detailed_explanation": User needs more in-depth explanation
   - "more_practice": User understands but needs practice
   - "next_difficulty": User is ready to move forward (if correct)

Return ONLY valid JSON:
{{
    "mistakes": [
        {{
            "mistake_type": "major",
            "description": "What the user did wrong",
            "concept_gap": "The underlying concept they're missing",
            "suggestion": "Specific advice to improve"
        }}
    ],
    "recommended_action": "detailed_explanation",
    "detailed_feedback": "Personalized, encouraging feedback explaining the mistake and how to improve"
}}"""


def get_code_evaluation_prompt(
    question: dict,
    user_code: str,
    test_results: list
) -> str:
    """
    Evaluate coding solution quality beyond just pass/fail.
    """
    
    passed_tests = sum(1 for t in test_results if t.get('passed'))
    total_tests = len(test_results)
    
    return f"""You are an expert code reviewer evaluating a student's solution.

**Problem**: {question.get('question_text')}
**User's Code**:
```
{user_code}
```

**Test Results**: {passed_tests}/{total_tests} tests passed

Evaluate:
1. Correctness (based on test results)
2. Code quality (readability, efficiency)
3. Approach (algorithm choice)
4. Mistakes and improvements

Return ONLY valid JSON:
{{
    "is_correct": {str(passed_tests == total_tests).lower()},
    "score": 85,
    "mistakes": [
        {{
            "mistake_type": "minor",
            "description": "Issue found",
            "concept_gap": "What to learn",
            "suggestion": "How to fix"
        }}
    ],
    "recommended_action": "more_practice",
    "detailed_feedback": "Comprehensive feedback on the solution",
    "code_quality_score": 80,
    "efficiency_notes": "Time/space complexity analysis"
}}"""
