"""
Prompt templates for AI question generation.
These prompts guide the LLM to generate high-quality, educational questions.
"""

def get_mcq_generation_prompt(
    topic: str,
    subtopic: str,
    difficulty: str,
    user_context: dict
) -> str:
    """
    Generate prompt for MCQ question creation.
    
    Args:
        topic: Main topic (e.g., "Arrays")
        subtopic: Specific subtopic (e.g., "Two Pointer Technique")
        difficulty: beginner/intermediate/advanced/expert
        user_context: User's learning history and weak areas
    """
    
    return f"""You are an expert educator creating a multiple-choice question for a skill-based learning platform.

**Topic**: {topic}
**Subtopic**: {subtopic}
**Difficulty**: {difficulty}
**User Context**: The learner has attempted {user_context.get('questions_attempted', 0)} questions with {user_context.get('accuracy', 0)}% accuracy.

Create a {difficulty}-level MCQ that:
1. Tests conceptual understanding, not just memorization
2. Has 4 options with only ONE correct answer
3. Includes plausible distractors (wrong answers that seem reasonable)
4. Provides a clear, educational explanation
5. Includes 2-3 progressive hints

Return ONLY valid JSON in this exact format:
{{
    "question_text": "The question here",
    "options": [
        {{"id": "a", "text": "Option A", "is_correct": false}},
        {{"id": "b", "text": "Option B", "is_correct": true}},
        {{"id": "c", "text": "Option C", "is_correct": false}},
        {{"id": "d", "text": "Option D", "is_correct": false}}
    ],
    "explanation": "Detailed explanation of why B is correct and why others are wrong",
    "hints": [
        "First hint - gentle nudge",
        "Second hint - more specific",
        "Third hint - almost gives it away"
    ],
    "xp_reward": 50
}}"""


def get_snippet_generation_prompt(
    topic: str,
    subtopic: str,
    difficulty: str,
    language: str
) -> str:
    """Generate prompt for code snippet question (what does this code do?)"""
    
    return f"""You are an expert programming educator creating a code snippet analysis question.

**Topic**: {topic}
**Subtopic**: {subtopic}
**Difficulty**: {difficulty}
**Language**: {language}

Create a code snippet question that:
1. Shows a short, meaningful code snippet (5-15 lines)
2. Asks what the code does or what it outputs
3. Tests understanding of {subtopic} concepts
4. Is appropriate for {difficulty} level

Return ONLY valid JSON:
{{
    "question_text": "What does this code output?",
    "code_snippet": "def example():\\n    # code here",
    "language": "{language}",
    "options": [
        {{"id": "a", "text": "Output A", "is_correct": false}},
        {{"id": "b", "text": "Output B", "is_correct": true}},
        {{"id": "c", "text": "Output C", "is_correct": false}},
        {{"id": "d", "text": "Output D", "is_correct": false}}
    ],
    "explanation": "Step-by-step walkthrough of the code execution",
    "hints": ["Hint 1", "Hint 2"],
    "xp_reward": 75
}}"""


def get_coding_generation_prompt(
    topic: str,
    subtopic: str,
    difficulty: str,
    language: str
) -> str:
    """Generate prompt for coding challenge question"""
    
    return f"""You are an expert programming educator creating a coding challenge.

**Topic**: {topic}
**Subtopic**: {subtopic}
**Difficulty**: {difficulty}
**Language**: {language}

Create a coding problem that:
1. Has a clear problem statement
2. Includes input/output examples
3. Has 3-5 test cases (including edge cases)
4. Provides starter code template
5. Is solvable in {difficulty} level

Return ONLY valid JSON:
{{
    "question_text": "Problem description with examples",
    "language": "{language}",
    "starter_code": "def solution():\\n    # Your code here\\n    pass",
    "test_cases": [
        {{"input": "test input", "expected_output": "expected result", "is_hidden": false}},
        {{"input": "edge case", "expected_output": "result", "is_hidden": true}}
    ],
    "constraints": ["Time: O(n)", "Space: O(1)"],
    "explanation": "Approach and solution explanation",
    "hints": ["Hint 1", "Hint 2", "Hint 3"],
    "xp_reward": 150
}}"""
