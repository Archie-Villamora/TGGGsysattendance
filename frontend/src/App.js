import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Dashboard from './Dashboard';
import Profile from './Profile';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(data);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser({});
    setCurrentPage('dashboard');
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'profile':
        return <Profile token={token} user={user} onLogout={handleLogout} />;
      default:
        return <Dashboard token={token} user={user} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="app">
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src="/imgs/logostick.png" 
            alt="Triple G BuildHub Logo" 
            style={{ height: '40px', width: 'auto' }}
          />
          <h1>Triple G BuildHub - OJT Attendance</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => setCurrentPage('dashboard')}
            style={{
              background: currentPage === 'dashboard' ? '#FF7120' : 'transparent',
              color: currentPage === 'dashboard' ? 'white' : '#FF7120',
              border: '1px solid rgba(255, 113, 32, 0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentPage('profile')}
            style={{
              background: 'transparent',
              border: `2px solid ${currentPage === 'profile' ? '#FF7120' : 'rgba(255, 113, 32, 0.3)'}`,
              padding: '2px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              transition: 'all 0.2s',
              boxShadow: currentPage === 'profile' ? '0 0 0 2px rgba(255, 113, 32, 0.2)' : 'none'
            }}
          >
            {userProfile?.profile_picture ? (
              <img 
                src={userProfile.profile_picture} 
                alt="Profile" 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF7120, #e66310)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>
      <div style={{ paddingTop: 0 }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
