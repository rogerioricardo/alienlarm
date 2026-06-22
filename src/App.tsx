import { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { Usuario } from './types';

export default function App() {
  const [view, setView] = useState<'home' | 'auth' | 'app'>('home');
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

  const handleLoginSuccess = (user: Usuario) => {
    setCurrentUser(user);
    setView('app');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen">
      {view === 'home' && (
        <LandingPage onNavigateLogin={() => setView('auth')} />
      )}

      {view === 'auth' && (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          onBackToHome={() => setView('home')} 
        />
      )}

      {view === 'app' && currentUser && (
        <Dashboard 
          currentUser={currentUser} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}
