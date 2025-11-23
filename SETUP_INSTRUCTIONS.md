# Setup Instructions - Fix Your Errors

## Current Issues & Solutions

### ✅ Issue 1: Backend Dependencies (FIXED)
**Error**: `httpx version conflict` and `email_validator missing`

**Solution**: Updated `backend/requirements.txt` with compatible versions.

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### ✅ Issue 2: Frontend Missing Files (FIXED)
**Error**: `Could not auto-determine entry point` and `404 error`

**Solution**: Created missing files (`index.html`, `vite.config.ts`, etc.)

```bash
cd frontend
npm install
npm run dev
```

### ✅ Issue 3: Supabase Invalid URL (FIXED)
**Error**: `SupabaseException: Invalid URL`

**Solution**: Made Supabase client lazy-load with default values. The app will now start without `.env` file.

---

## Quick Start (Without Supabase Setup)

You can now run the app locally to see the UI, even without Supabase:

### 1. Start Backend (Development Mode)

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend will start at `http://localhost:8000` ✅

**Note**: API calls will fail without Supabase, but the server will run.

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at `http://localhost:5173` ✅

You should now see the **Landing Page**!

---

## Full Setup (With Supabase)

To make the app fully functional, you need to set up Supabase:

### Step 1: Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project (choose free tier)
4. Wait for project to initialize (~2 minutes)

### Step 2: Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (click "Reveal" to see it)

### Step 3: Setup Database

1. Go to **SQL Editor** in Supabase
2. Click "New Query"
3. Copy the entire contents of `backend/database_schema.sql`
4. Paste and click "Run"
5. You should see "Success. No rows returned"

### Step 4: Configure Backend

Create `backend/.env`:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# AI Configuration (Optional for now)
GEMINI_API_KEY=your_gemini_key_or_leave_placeholder
GEMINI_MODEL=gemini-1.5-flash

# Judge0 Configuration (Optional for now)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key_or_leave_placeholder

# Security
SECRET_KEY=your_secret_key_here
```

Generate a secret key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 5: Restart Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Step 6: Test It!

1. Open `http://localhost:5173`
2. Click "Start Learning Free"
3. Create an account
4. You should be redirected to the dashboard!

---

## Get API Keys (Optional - For Full Functionality)

### Gemini API Key (Free)

1. Go to [ai.google.dev](https://ai.google.dev)
2. Click "Get API Key"
3. Create a new API key
4. Add to `backend/.env`: `GEMINI_API_KEY=your_key`

**What it enables**: AI question generation and evaluation

### Judge0 API Key (Free Tier Available)

1. Go to [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Subscribe to free tier (500 requests/month)
3. Copy your API key
4. Add to `backend/.env`: `JUDGE0_API_KEY=your_key`

**What it enables**: Code execution for coding questions

---

## Troubleshooting

### Backend won't start

**Check Python version**:
```bash
python --version  # Should be 3.10+
```

**Reinstall dependencies**:
```bash
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend shows blank page

**Check browser console** (F12):
- Look for errors
- Check if API calls are failing

**Verify files exist**:
```bash
cd frontend
ls index.html  # Should exist
ls src/main.tsx  # Should exist
```

**Reinstall dependencies**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### "Invalid URL" error persists

Make sure you:
1. Created `backend/.env` file
2. Added your Supabase URL (not the placeholder)
3. Restarted the backend server

### Can't create account

This means Supabase isn't configured. Follow "Full Setup" above.

---

## What Works Without API Keys

✅ **Without Supabase**: 
- Frontend UI loads
- Can see landing page
- ❌ Can't login/register

✅ **Without Gemini**:
- Can login/register
- Can see dashboard
- ❌ Can't generate questions

✅ **Without Judge0**:
- Everything works
- ❌ Can't run coding questions (MCQ and snippets still work)

---

## Next Steps

1. **Start with UI**: Run frontend to see the design
2. **Add Supabase**: Enable authentication and data storage
3. **Add Gemini**: Enable AI question generation
4. **Add Judge0**: Enable code execution (optional)

## Quick Commands

```bash
# Backend
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# Frontend
cd frontend && npm run dev

# Check if backend is running
curl http://localhost:8000

# Check if frontend is running
curl http://localhost:5173
```

---

Need help? Check:
- `README.md` - Full documentation
- `QUICKSTART.md` - 15-minute setup guide
- `ARCHITECTURE.md` - How everything works
