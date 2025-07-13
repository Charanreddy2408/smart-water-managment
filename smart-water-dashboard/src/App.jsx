import React, { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import Dashboard from './components/Dashboard';
import WelcomeSplash from './components/WelcomeSplash';
import './index.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="App bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
        {showSplash && <WelcomeSplash onFinish={() => setShowSplash(false)} />}
        {!showSplash && <Dashboard />}
      </div>
    </I18nextProvider>
  );
}

export default App;
