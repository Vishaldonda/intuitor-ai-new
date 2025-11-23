# SkillForge LMS - Quick Start Guide

Get your AI-powered LMS running in 15 minutes!

## 🚀 Prerequisites

- Python 3.10+
- Node.js 18+
- Supabase account (free tier works)
- Gemini API key (free tier available)
- Judge0 RapidAPI key (optional for coding questions)

## ⚡ Quick Setup

### Step 1: Clone and Setup Backend (5 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

### Step 2: Configure Supabase (3 minutes)

1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Project Settings → API
3. Copy your project URL and anon key
4. Go to SQL Editor and run `database_schema.sql`
5. Update `.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

### Step 3: Get Gemini API Key (2 minutes)

1. Go to [ai.google.dev](https://ai.google.dev)
2. Click "Get API Key"
3. Create a new API key
4. Add to `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
```

### Step 4: Get Judge0 API Key (Optional, 2 minutes)

1. Go to [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Subscribe to free tier
3. Copy your API key
4. Add to `.env`:

```env
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key
```

### Step 5: Start Backend (1 minute)

```bash
# Generate a secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Add to .env
SECRET_KEY=your_generated_secret

# Start server
uvicorn app.main:app --reload
```

Backend running at `http://localhost:8000` ✅

### Step 6: Setup Frontend (2 minutes)

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Create .env
cp .env.example .env

# Update .env
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Start dev server
npm run dev
```

Frontend running at `http://localhost:5173` ✅

## 🎉 You're Done!

Open `http://localhost:5173` and:

1. Click "Start Learning Free"
2. Create an account
3. Start learning!

## 🧪 Test the System

### Test Question Generation

```bash
# In a new terminal
curl -X POST "http://localhost:8000/api/questions/adaptive?user_id=YOUR_USER_ID&topic_id=TOPIC_ID"
```

### Test Evaluation

```bash
curl -X POST "http://localhost:8000/api/evaluation/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "question_id": "QUESTION_ID",
    "user_id": "USER_ID",
    "selected_option_id": "a"
  }'
```

## 🐛 Troubleshooting

### Backend won't start

**Error**: `ModuleNotFoundError`
```bash
# Make sure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt
```

**Error**: `Connection refused` (Supabase)
```bash
# Check your Supabase URL and keys in .env
# Make sure you ran database_schema.sql
```

### Frontend won't start

**Error**: `Cannot find module`
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error**: `Network Error` when calling API
```bash
# Check backend is running on port 8000
# Check VITE_API_URL in frontend/.env
```

### AI Generation Fails

**Error**: `Invalid API key`
```bash
# Verify your Gemini API key
# Check quota at ai.google.dev
```

**Error**: `JSON parse error`
```bash
# This is usually a temporary issue
# Try again or adjust temperature in llm_client.py
```

## 📚 Next Steps

### Add Sample Data

Run this in Supabase SQL Editor to add more courses:

```sql
-- Add more topics
INSERT INTO topics (course_id, name, description, "order", difficulty, estimated_minutes)
SELECT 
    c.id,
    'Stacks & Queues',
    'Learn stack and queue data structures',
    3,
    'intermediate',
    50
FROM courses c WHERE c.name = 'Data Structures & Algorithms';
```

### Customize Question Generation

Edit prompts in `backend/app/ai/prompts/question_prompts.py`:

```python
def get_mcq_generation_prompt(topic, subtopic, difficulty, user_context):
    return f"""
    Create a {difficulty} MCQ about {topic} - {subtopic}.
    
    Make it:
    - Practical and real-world focused
    - Include code examples
    - Test deep understanding
    
    [Your custom instructions here]
    """
```

### Adjust Difficulty Algorithm

Edit `backend/app/services/progress_service.py`:

```python
def _adjust_difficulty(self, current_difficulty, accuracy, questions_attempted, recommended_action):
    # Your custom logic here
    if accuracy >= 90:  # Increase threshold
        return self._increase_difficulty(current_difficulty)
    # ...
```

### Customize UI Theme

Edit `frontend/tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      }
    }
  }
}
```

## 🚀 Deploy to Production

### Backend (Railway)

1. Create Railway account
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy!

### Frontend (Vercel)

1. Create Vercel account
2. Import GitHub repository
3. Set `VITE_API_URL` to your Railway URL
4. Deploy!

## 📖 Learn More

- [Full Documentation](README.md)
- [Architecture Guide](ARCHITECTURE.md)
- [API Documentation](http://localhost:8000/api/docs)

## 💬 Get Help

- Check existing issues on GitHub
- Read the troubleshooting section
- Review the architecture documentation

## 🎯 Quick Commands Reference

```bash
# Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev

# Database
# Run in Supabase SQL Editor
\i database_schema.sql

# Tests
cd backend
pytest

cd frontend
npm test
```

---

Happy Learning! 🎓
