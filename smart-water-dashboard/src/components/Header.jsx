import React from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Settings, RefreshCw, Globe } from 'lucide-react';

const Header = ({ onRefresh, isRefreshing, lastUpdated }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'te', name: 'తెలుగు' }
  ];

  const formatLastUpdated = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('time.now');
    if (minutes < 60) return `${minutes} ${minutes === 1 ? t('time.minute') : t('time.minutes')} ${t('time.ago')}`;
    if (hours < 24) return `${hours} ${hours === 1 ? t('time.hour') : t('time.hours')} ${t('time.ago')}`;
    return `${days} ${days === 1 ? t('time.day') : t('time.days')} ${t('time.ago')}`;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Droplets className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">
                  {t('dashboard.title')}
                </h1>
                <p className="text-sm text-gray-500">
                  {t('dashboard.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Last Updated */}
            {lastUpdated && (
              <div className="hidden sm:block text-sm text-gray-500">
                {t('dashboard.lastUpdated')}: {formatLastUpdated(lastUpdated)}
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t('dashboard.refresh')}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <select
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Settings Button */}
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Settings className="h-4 w-4 mr-2" />
              {t('dashboard.settings')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 