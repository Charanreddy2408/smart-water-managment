import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <div className="App">
        <Dashboard />
      </div>
    </I18nextProvider>
  );
}

export default App;
