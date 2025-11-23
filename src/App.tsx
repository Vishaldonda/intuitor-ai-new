import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import TopicPage from './components/TopicPage';
import QuestionScreen from './components/QuestionScreen';
import ResultScreen from './components/ResultScreen';
import ProfilePage from './components/ProfilePage';

function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('landing');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onStart={() => setCurrentScreen('dashboard')} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentScreen} />;
      case 'topic':
        return <TopicPage onNavigate={setCurrentScreen} />;
      case 'question':
        return <QuestionScreen onNavigate={setCurrentScreen} />;
      case 'result':
        return <ResultScreen onNavigate={setCurrentScreen} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentScreen} />;
      default:
        return <LandingPage onStart={() => setCurrentScreen('dashboard')} />;
    }
  };

  return renderScreen();
}

export default App;
