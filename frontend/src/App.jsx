import React, { useState, useEffect, useCallback } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import { testBackendConnection } from './services/apiService.js';
import config from './constants.js';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [backendConnected, setBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const manifest = new Manifest({ appId: config.APP_ID, baseURL: config.BACKEND_URL });

  const checkUserSession = useCallback(async () => {
    try {
      const currentUser = await manifest.from('User').me();
      setUser(currentUser);
      setCurrentScreen('dashboard');
    } catch (error) {
      setUser(null);
      setCurrentScreen('landing');
    } finally {
      setIsLoading(false);
    }
  }, [manifest]);

  useEffect(() => {
    const checkConnectionAndSession = async () => {
      console.log('🚀 [APP] Starting backend connection test...');
      const result = await testBackendConnection();
      setBackendConnected(result.success);
      
      if (result.success) {
        console.log('✅ [APP] Backend connection successful. Checking user session...');
        await checkUserSession();
      } else {
        console.error('❌ [APP] Backend connection failed.');
        setIsLoading(false);
      }
    };
    
    checkConnectionAndSession();
  }, [checkUserSession]);

  const login = async (email, password) => {
    await manifest.login(email, password);
    await checkUserSession();
  };

  const signup = async (name, email, password, role) => {
    await manifest.from('User').signup({ name, email, password, role });
    await login(email, password);
  };

  const logout = async () => {
    await manifest.logout();
    setUser(null);
    setCurrentScreen('landing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading Application...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <span className={`h-3 w-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${backendConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {backendConnected ? 'Backend Connected' : 'Backend Disconnected'}
        </span>
      </div>
      
      {currentScreen === 'landing' ? (
        <LandingPage onLogin={login} onSignup={signup} />
      ) : (
        <DashboardPage user={user} onLogout={logout} manifest={manifest} />
      )}
    </div>
  );
}

export default App;
