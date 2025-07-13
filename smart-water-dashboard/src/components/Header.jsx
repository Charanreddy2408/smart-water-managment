import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Settings, RefreshCw, Globe, Menu, X } from 'lucide-react';

const Header = ({ onRefresh, isRefreshing, lastUpdated }) => {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
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

  const handleRefresh = () => {
    onRefresh();
    setIsMobileMenuOpen(false); // Close mobile menu after refresh
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Droplets className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  {t('dashboard.title')}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                  {t('dashboard.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Last Updated */}
            {lastUpdated && (
              <div className="text-sm text-gray-500">
                {t('dashboard.lastUpdated')}: {formatLastUpdated(lastUpdated)}
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
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
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Settings className="h-4 w-4 mr-2" />
              {t('dashboard.settings')}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
          {/* Last Updated - Mobile */}
          {lastUpdated && (
            <div className="px-3 py-2 text-sm text-gray-500 bg-white rounded-md">
              <div className="font-medium">{t('dashboard.lastUpdated')}</div>
              <div>{formatLastUpdated(lastUpdated)}</div>
            </div>
          )}

          {/* Refresh Button - Mobile */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t('dashboard.refresh')}
          </button>

          {/* Language Switcher - Mobile */}
          <div className="px-3 py-2 bg-white rounded-md">
            <div className="flex items-center mb-2">
              <Globe className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">{t('dashboard.language')}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    i18n.language === lang.code
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Button - Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Settings className="h-4 w-4 mr-3" />
            {t('dashboard.settings')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 