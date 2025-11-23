# SkillForge LMS - AI-Powered Skill-Based Learning Platform

A complete Learning Management System with AI-driven personalized learning, adaptive difficulty, and gamified progression.

## 🚀 Features

- **AI-Powered Question Generation**: Gemini generates personalized MCQ, code snippet, and coding questions
- **Adaptive Difficulty**: System adjusts difficulty based on user performance
- **AI Evaluation & Feedback**: Detailed mistake analysis and learning recommendations
- **Code Execution**: Judge0 integration for running and testing code
- **Gamification**: XP, levels, streaks, and achievements
- **Progress Tracking**: Comprehensive analytics and learning insights

## 📁 Project Structure

```
skillforge-lms/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── ai/                # AI Pipeline
│   │   │   ├── llm_client.py  # Gemini client
│   │   │   ├── generators/    # Question generators
│   │   │   ├── evaluators/    # Answer evaluators
│   │   │   └── prompts/       # Prompt templates
│   │   ├── api/               # API Routers
│   │   │   ├── auth.py
│   │   │   ├── course.py
│   │   │   ├── topic.py
│   │   │   ├── question.py
│   │   │   ├── evaluation.py
│   │   │   └── progress.py
│   │   ├── services/          # Business Logic
│   │   │   ├── judge0_service.py
│   │   │   └── progress_service.py
│   │   ├── db/                # Database
│   │   │   └── supabase_client.py
│   │   ├── models/            # Pydantic Models
│   │   │   └── schemas.py
│   │   ├── core/              # Config
│   │   │   └── config.py
│   │   └── main.py            # FastAPI App
│   ├── requirements.txt
│   ├── .env.example
│   └── database_schema.sql
│
└── frontend/                   # React Frontend
    ├── src/
    │   ├── components/        # Reusable Components
    │   │   ├── MCQQuestion.tsx
    │   │   ├── CodeEditor.tsx
    │   │   ├── XPBar.tsx
    │   │   └── LevelUpModal.tsx
    │   ├── pages/             # Page Components
    │   │   ├── LandingPage.tsx
    │   │   ├── DashboardPage.tsx
    │   │   ├── CoursePage.tsx
    │   │   ├── QuestionPage.tsx
    │   │   └── ProfilePage.tsx
    │   ├── context/           # React Context
    │   │   ├── UserContext.tsx
    │   │   └── ProgressContext.tsx
    │   ├── services/          # API Client
    │   │   └── api.ts
    │   └── App.tsx
    ├── package.json
    └── .env.example
```

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Supabase**: Database + Authentication
- **Gemini AI**: Question generation and evaluation
- **Judge0**: Code execution sandbox
- **LangChain**: AI pipeline orchestration

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Monaco Editor**: Code editor
- **Axios**: HTTP client

## 📦 Installation

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Create virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**:
```bash
cp .env.example .env
# Edit .env with your credentials
```

5. **Setup Supabase database**:
- Create a Supabase project
- Run `database_schema.sql` in Supabase SQL Editor
- Copy your Supabase URL and keys to `.env`

6. **Run the server**:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at `http://localhost:8000`
API docs at `http://localhost:8000/api/docs`

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with backend URL
```

4. **Run development server**:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 🔑 Environment Variables

### Backend (.env)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
GEMINI_API_KEY=your_gemini_api_key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key
SECRET_KEY=your_secret_key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

## 🧠 How It Works

### 1. AI Question Generation Pipeline

```
User Request → Get User Progress → Select Difficulty → 
Generate Prompt → Gemini API → Parse JSON → Save Question
```

**Key Files**:
- `backend/app/ai/generators/question_generator.py`
- `backend/app/ai/prompts/question_prompts.py`
- `backend/app/ai/llm_client.py`

### 2. Answer Evaluation Pipeline

```
User Answer → Run Tests (if coding) → AI Analysis → 
Mistake Classification → Learning Recommendation → Update Progress
```

**Key Files**:
- `backend/app/ai/evaluators/answer_evaluator.py`
- `backend/app/services/judge0_service.py`
- `backend/app/services/progress_service.py`

### 3. Adaptive Difficulty System

The system adjusts difficulty based on:
- **Accuracy**: >80% → increase, <50% → decrease
- **Questions Attempted**: Minimum 5 before adjustment
- **AI Recommendation**: Overrides if strong signal
- **Mistake Types**: Major mistakes → revision needed

**Algorithm** (in `progress_service.py`):
```python
if accuracy >= 80 and questions >= 10:
    increase_difficulty()
elif accuracy < 50:
    decrease_difficulty()
elif ai_recommends_revision:
    decrease_difficulty()
```

### 4. XP & Leveling System

**XP Calculation**:
- Base XP per question (50-150 based on type)
- Difficulty multiplier (1x-3x)
- Speed bonus (20% if under 2 minutes)
- Partial credit (20% for incorrect attempts)

**Level Formula**:
```python
level = floor(sqrt(xp / 100))
xp_for_next_level = (level + 1)² * 100
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses & Topics
- `GET /api/courses` - List all courses
- `GET /api/courses/{id}` - Get course with topics
- `GET /api/topics/{id}` - Get topic details

### Questions
- `POST /api/questions/generate` - Generate specific question
- `POST /api/questions/adaptive` - Generate adaptive question
- `GET /api/questions/{id}` - Get question by ID

### Evaluation
- `POST /api/evaluation/submit` - Submit answer for evaluation
- `POST /api/evaluation/hint/{id}` - Get hint for question

### Progress
- `GET /api/progress/user/{id}` - Get user progress
- `GET /api/progress/topic/{user_id}/{topic_id}` - Get topic progress
- `GET /api/progress/stats/{id}` - Get user statistics

## 🎨 Frontend Architecture

### Context Providers
- **UserContext**: Global user state, authentication
- **ProgressContext**: Learning progress tracking

### Key Components
- **MCQQuestion**: Multiple choice interface
- **CodeEditor**: Monaco-based code editor
- **XPBar**: Animated progress bar
- **LevelUpModal**: Celebration modal

### Pages
- **LandingPage**: Marketing + auth
- **DashboardPage**: Main hub
- **CoursePage**: Topic selection
- **QuestionPage**: Learning interface
- **ProfilePage**: Stats and achievements

## 🚀 Deployment

### Backend (Railway/Render)
```bash
# Build command
pip install -r requirements.txt

# Start command
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend (Vercel/Netlify)
```bash
# Build command
npm run build

# Output directory
dist
```

## 📝 Adding New Features

### Add New Question Type
1. Update `QuestionType` enum in `schemas.py`
2. Create prompt in `question_prompts.py`
3. Add generator logic in `question_generator.py`
4. Create evaluator in `answer_evaluator.py`
5. Add frontend component

### Add New Course
1. Insert into `courses` table
2. Add topics with `course_id`
3. Add subtopics with `topic_id`
4. System will automatically generate questions

## 🐛 Troubleshooting

**Backend won't start**:
- Check Python version (3.10+)
- Verify all environment variables
- Check Supabase connection

**Frontend API errors**:
- Verify backend is running
- Check CORS settings in `main.py`
- Verify API URL in frontend `.env`

**AI generation fails**:
- Check Gemini API key
- Verify API quota
- Check prompt format

## 📄 License

MIT License - feel free to use for learning and commercial projects.

## 🤝 Contributing

Contributions welcome! Please open an issue first to discuss changes.

---

Built with ❤️ using FastAPI, React, and Gemini AI
