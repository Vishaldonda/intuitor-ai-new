-- SkillForge LMS Database Schema for Supabase
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============= USER PROFILES =============
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============= COURSES =============
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT 'from-cyan-500 to-blue-600',
    total_topics INTEGER DEFAULT 0,
    estimated_hours INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============= TOPICS =============
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
    estimated_minutes INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============= SUBTOPICS =============
CREATE TABLE subtopics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============= QUESTIONS =============
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    topic_id UUID REFERENCES topics(id),
    subtopic_id UUID REFERENCES subtopics(id),
    question_type TEXT CHECK (question_type IN ('mcq', 'snippet', 'coding')),
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
    question_text TEXT NOT NULL,
    options JSONB, -- For MCQ/snippet questions
    code_snippet TEXT, -- For snippet questions
    language TEXT, -- For coding questions
    test_cases JSONB, -- For coding questions
    starter_code TEXT, -- For coding questions
    explanation TEXT,
    hints JSONB DEFAULT '[]'::jsonb,
    xp_reward INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============= USER PROGRESS =============
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    current_difficulty TEXT DEFAULT 'beginner',
    questions_attempted INTEGER DEFAULT 0,
    questions_correct INTEGER DEFAULT 0,
    accuracy DECIMAL(5,2) DEFAULT 0,
    total_xp_earned INTEGER DEFAULT 0,
    mastery_level INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
);

-- ============= QUESTION ATTEMPTS =============
CREATE TABLE question_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id),
    is_correct BOOLEAN NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    time_taken INTEGER, -- in seconds
    mistakes JSONB DEFAULT '[]'::jsonb,
    recommended_action TEXT,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============= INDEXES =============
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_topic_id ON user_progress(topic_id);
CREATE INDEX idx_question_attempts_user_id ON question_attempts(user_id);
CREATE INDEX idx_question_attempts_topic_id ON question_attempts(topic_id);
CREATE INDEX idx_topics_course_id ON topics(course_id);
CREATE INDEX idx_subtopics_topic_id ON subtopics(topic_id);

-- ============= SEED DATA =============

-- Insert sample courses
INSERT INTO courses (name, description, color, total_topics, estimated_hours) VALUES
('Data Structures & Algorithms', 'Master fundamental DSA concepts', 'from-cyan-500 to-blue-600', 15, 40),
('HTML & CSS', 'Build beautiful web interfaces', 'from-orange-500 to-red-600', 10, 20),
('JavaScript', 'Learn modern JavaScript', 'from-yellow-500 to-orange-600', 12, 30);

-- Insert sample topics for DSA
INSERT INTO topics (course_id, name, description, "order", difficulty, estimated_minutes)
SELECT 
    c.id,
    'Arrays',
    'Learn array manipulation and algorithms',
    1,
    'beginner',
    45
FROM courses c WHERE c.name = 'Data Structures & Algorithms';

INSERT INTO topics (course_id, name, description, "order", difficulty, estimated_minutes)
SELECT 
    c.id,
    'Linked Lists',
    'Master linked list operations',
    2,
    'intermediate',
    60
FROM courses c WHERE c.name = 'Data Structures & Algorithms';

-- Insert sample topics for HTML/CSS
INSERT INTO topics (course_id, name, description, "order", difficulty, estimated_minutes)
SELECT 
    c.id,
    'HTML Basics',
    'Learn HTML structure and semantic tags',
    1,
    'beginner',
    30
FROM courses c WHERE c.name = 'HTML & CSS';

-- ============= ROW LEVEL SECURITY =============

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Question attempts policies
CREATE POLICY "Users can view own attempts" ON question_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON question_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for courses, topics, subtopics, questions
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Anyone can view topics" ON topics FOR SELECT USING (true);
CREATE POLICY "Anyone can view subtopics" ON subtopics FOR SELECT USING (true);
CREATE POLICY "Anyone can view questions" ON questions FOR SELECT USING (true);

-- ============= FUNCTIONS & TRIGGERS =============

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration (creates profile automatically)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    now(),
    now()
  );
  RETURN new;
END;
$$;

-- Trigger to automatically create user profile on auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();