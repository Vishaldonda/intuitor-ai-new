# SkillForge LMS - Architecture Documentation

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React + TypeScript + Tailwind + Framer Motion              │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Landing  │  │Dashboard │  │ Question │  │ Profile  │   │
│  │   Page   │  │   Page   │  │   Page   │  │   Page   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Context (User, Progress)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTP/REST API
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                      BACKEND API                              │
│              FastAPI + Python                                 │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │ Question │  │Evaluation│  │ Progress │   │
│  │  Router  │  │  Router  │  │  Router  │  │  Router  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              SERVICES LAYER                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │   Progress   │  │    Judge0    │  │     AI      │ │ │
│  │  │   Service    │  │   Service    │  │  Pipeline   │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────┬────────────────┬────────────────┬────────────┘
               │                │                │
               ▼                ▼                ▼
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │ Supabase │    │  Judge0  │    │  Gemini  │
        │    DB    │    │   API    │    │   API    │
        └──────────┘    └──────────┘    └──────────┘
```

## 📊 Data Flow Diagrams

### 1. Question Generation Flow

```
User clicks "Start Learning"
         │
         ▼
Frontend: GET /api/questions/adaptive?user_id=X&topic_id=Y
         │
         ▼
Backend: question.py router
         │
         ▼
Get user progress from Supabase
         │
         ▼
question_generator.generate_adaptive_question()
         │
         ├─> Determine difficulty (based on accuracy)
         ├─> Select question type (MCQ/snippet/coding)
         └─> Build context from user history
         │
         ▼
Generate prompt from template
         │
         ▼
Gemini API: Generate question JSON
         │
         ▼
Parse and validate JSON
         │
         ▼
Save question to Supabase
         │
         ▼
Return question to frontend
         │
         ▼
Frontend: Display question component
```

### 2. Answer Evaluation Flow

```
User submits answer
         │
         ▼
Frontend: POST /api/evaluation/submit
         │
         ▼
Backend: evaluation.py router
         │
         ▼
Get question from database
         │
         ▼
answer_evaluator.evaluate_answer()
         │
         ├─> If MCQ: Check correct option
         ├─> If Snippet: Check correct option
         └─> If Coding: Run code via Judge0
         │
         ▼
[For Coding Questions]
judge0_service.run_test_cases()
         │
         ├─> Submit code to Judge0
         ├─> Poll for results
         └─> Compare outputs
         │
         ▼
Generate evaluation prompt
         │
         ▼
Gemini API: Analyze mistakes
         │
         ▼
Parse AI feedback
         │
         ▼
progress_service.update_progress()
         │
         ├─> Update user XP
         ├─> Check for level up
         ├─> Adjust difficulty
         ├─> Update topic progress
         └─> Save attempt record
         │
         ▼
Return evaluation + progress to frontend
         │
         ▼
Frontend: Show results + feedback
```

### 3. Adaptive Difficulty Algorithm

```
User completes question
         │
         ▼
Get current progress:
  - accuracy
  - questions_attempted
  - current_difficulty
         │
         ▼
AI Recommendation:
  - revision
  - detailed_explanation
  - more_practice
  - next_difficulty
         │
         ▼
Decision Logic:
         │
         ├─> If questions < 5: Keep current difficulty
         │
         ├─> If accuracy >= 80% AND questions >= 10:
         │   └─> Increase difficulty
         │
         ├─> If accuracy < 50%:
         │   └─> Decrease difficulty
         │
         └─> If AI recommends revision:
             └─> Decrease difficulty
         │
         ▼
Update user_progress.current_difficulty
         │
         ▼
Next question uses new difficulty
```

## 🧠 AI Pipeline Architecture

### Question Generation Pipeline

```python
# Located in: backend/app/ai/generators/question_generator.py

class QuestionGenerator:
    """
    Generates personalized questions using AI
    """
    
    def generate_adaptive_question(user_id, topic_id, user_progress):
        # 1. Analyze user performance
        accuracy = user_progress.accuracy
        questions_attempted = user_progress.questions_attempted
        
        # 2. Determine difficulty
        if accuracy >= 80 and questions_attempted >= 5:
            difficulty = increase_difficulty()
        elif accuracy < 50:
            difficulty = decrease_difficulty()
        else:
            difficulty = current_difficulty
        
        # 3. Select question type
        question_type = select_question_type(questions_attempted)
        
        # 4. Build prompt with context
        prompt = build_prompt(
            topic=topic,
            difficulty=difficulty,
            question_type=question_type,
            user_context=user_progress
        )
        
        # 5. Generate with Gemini
        question_json = gemini_client.generate_json(prompt)
        
        # 6. Validate and return
        return validate_question(question_json)
```

### Evaluation Pipeline

```python
# Located in: backend/app/ai/evaluators/answer_evaluator.py

class AnswerEvaluator:
    """
    Evaluates answers and provides AI feedback
    """
    
    def evaluate_answer(question, user_answer, question_type):
        # 1. Check correctness
        if question_type == "coding":
            # Run code via Judge0
            test_results = judge0_service.run_test_cases(
                code=user_answer,
                test_cases=question.test_cases
            )
            is_correct = all(test.passed for test in test_results)
        else:
            # Check MCQ/snippet answer
            is_correct = check_option(user_answer, question.options)
        
        # 2. Calculate score and XP
        score = calculate_score(is_correct, test_results)
        xp = calculate_xp(score, difficulty, time_taken)
        
        # 3. AI mistake analysis
        if not is_correct:
            prompt = build_mistake_analysis_prompt(
                question=question,
                user_answer=user_answer,
                correct_answer=correct_answer
            )
            
            ai_analysis = gemini_client.generate_json(prompt)
            mistakes = ai_analysis.mistakes
            recommended_action = ai_analysis.recommended_action
        
        # 4. Return comprehensive evaluation
        return {
            "is_correct": is_correct,
            "score": score,
            "xp_earned": xp,
            "mistakes": mistakes,
            "recommended_action": recommended_action,
            "detailed_feedback": ai_analysis.feedback
        }
```

## 🗄️ Database Schema

### Core Tables

**user_profiles**
- Stores user account info, XP, level, streak
- Links to Supabase Auth

**courses**
- Top-level learning paths (DSA, HTML, CSS, JS)

**topics**
- Specific topics within courses (Arrays, Loops, etc.)

**subtopics**
- Granular subtopics for targeted learning

**questions**
- AI-generated questions with metadata
- Stores options, test cases, hints

**user_progress**
- Tracks progress per topic
- Stores accuracy, difficulty, mastery level

**question_attempts**
- Records every attempt with evaluation
- Used for analytics and mistake patterns

### Relationships

```
courses (1) ──< (N) topics
topics (1) ──< (N) subtopics
topics (1) ──< (N) questions
users (1) ──< (N) user_progress
users (1) ──< (N) question_attempts
questions (1) ──< (N) question_attempts
```

## 🔐 Security Architecture

### Authentication Flow

1. User registers/logs in via Supabase Auth
2. Supabase returns JWT access token
3. Frontend stores token in localStorage
4. Token sent in Authorization header for all requests
5. Backend validates token with Supabase

### Row Level Security (RLS)

- Users can only access their own data
- Courses/topics are publicly readable
- Progress and attempts are user-scoped

### API Security

- CORS configured for allowed origins
- Rate limiting (TODO: implement)
- Input validation via Pydantic models
- SQL injection prevention via ORM

## 🎮 Gamification System

### XP Calculation

```python
def calculate_xp_reward(base_xp, difficulty, time_taken, is_correct):
    if not is_correct:
        return base_xp * 0.2  # 20% for attempt
    
    # Difficulty multiplier
    multipliers = {
        "beginner": 1.0,
        "intermediate": 1.5,
        "advanced": 2.0,
        "expert": 3.0
    }
    xp = base_xp * multipliers[difficulty]
    
    # Speed bonus (under 2 minutes)
    if time_taken < 120:
        xp *= 1.2
    
    return int(xp)
```

### Level System

```python
# Level formula: level = floor(sqrt(xp / 100))
# XP for next level: (level + 1)² * 100

Level 1: 0 XP
Level 2: 400 XP
Level 3: 900 XP
Level 4: 1,600 XP
Level 5: 2,500 XP
...
Level 10: 10,000 XP
```

### Streak System

- Increments daily when user practices
- Resets if user misses a day
- Stored in `user_profiles.streak`

## 🔄 State Management (Frontend)

### UserContext

```typescript
// Global user state
{
  user: UserProfile | null,
  isAuthenticated: boolean,
  login: (email, password) => Promise<void>,
  logout: () => void,
  updateXP: (xp) => void
}
```

### ProgressContext

```typescript
// Learning progress state
{
  topicProgress: Record<topicId, Progress>,
  loadTopicProgress: (userId, topicId) => Promise<void>,
  updateProgress: (topicId, progress) => void
}
```

## 🚀 Performance Optimizations

### Backend

1. **Database Indexing**: Indexes on user_id, topic_id for fast queries
2. **Connection Pooling**: Supabase handles connection pooling
3. **Async Operations**: All I/O operations are async
4. **Caching**: (TODO) Redis for frequently accessed data

### Frontend

1. **Code Splitting**: React Router lazy loading
2. **Memoization**: React.memo for expensive components
3. **Debouncing**: Input debouncing for search
4. **Optimistic Updates**: Update UI before API response

## 📈 Scalability Considerations

### Current Architecture (MVP)

- Single FastAPI server
- Supabase (managed PostgreSQL)
- Stateless API (horizontal scaling ready)

### Future Scaling

1. **Load Balancer**: Distribute traffic across API servers
2. **Redis Cache**: Cache user sessions, frequent queries
3. **CDN**: Serve static frontend assets
4. **Queue System**: Celery for background tasks (email, analytics)
5. **Vector DB**: Pinecone/Weaviate for semantic search
6. **Microservices**: Split AI pipeline into separate service

## 🧪 Testing Strategy

### Backend Tests

```python
# Unit tests
- Test question generation logic
- Test evaluation algorithms
- Test XP calculations

# Integration tests
- Test API endpoints
- Test database operations
- Test external API calls (mocked)
```

### Frontend Tests

```typescript
// Component tests
- Test user interactions
- Test form submissions
- Test routing

// E2E tests
- Test complete user flows
- Test authentication
- Test question answering
```

## 📊 Monitoring & Analytics

### Metrics to Track

1. **User Metrics**
   - Daily/Monthly Active Users
   - Retention rate
   - Average session duration

2. **Learning Metrics**
   - Questions attempted per user
   - Average accuracy by topic
   - Time to complete topics

3. **System Metrics**
   - API response times
   - Error rates
   - AI generation success rate

### Tools

- **Backend**: FastAPI built-in metrics
- **Database**: Supabase analytics
- **Frontend**: Google Analytics / Mixpanel
- **Errors**: Sentry

## 🔮 Future Enhancements

1. **RAG System**: Use vector DB for context-aware questions
2. **Peer Learning**: Discussion forums, code reviews
3. **Live Competitions**: Timed challenges, leaderboards
4. **Mobile App**: React Native version
5. **Video Explanations**: AI-generated video tutorials
6. **Certificates**: Issue completion certificates
7. **Team Features**: Corporate training, team dashboards

---

This architecture is designed to be:
- **Modular**: Easy to add new features
- **Scalable**: Ready for horizontal scaling
- **Maintainable**: Clear separation of concerns
- **Extensible**: Plugin architecture for new question types
