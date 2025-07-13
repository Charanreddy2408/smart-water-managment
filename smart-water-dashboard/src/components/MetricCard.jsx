import React from 'react';
import { useTranslation } from 'react-i18next';
import { Thermometer, Droplets, Eye, Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const MetricCard = ({ type, value, status, trend }) => {
  const { t } = useTranslation();

  const getIcon = (type) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'tds':
        return <Droplets className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'turbidity':
        return <Eye className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'ph':
        return <Activity className="h-5 w-5 sm:h-6 sm:w-6" />;
      default:
        return <Activity className="h-5 w-5 sm:h-6 sm:w-6" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'danger':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-50 border-green-200 shadow-green-100';
      case 'good':
        return 'bg-blue-50 border-blue-200 shadow-blue-100';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 shadow-yellow-100';
      case 'danger':
        return 'bg-red-50 border-red-200 shadow-red-100';
      default:
        return 'bg-gray-50 border-gray-200 shadow-gray-100';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return '↗️';
    if (trend < 0) return '↘️';
    return '→';
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-500';
    if (trend < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return typeof value === 'number' ? value.toFixed(2) : value;
  };

  const getIdealRange = (type) => {
    switch (type) {
      case 'tds':
        return '< 300 ppm';
      case 'temperature':
        return '20-25°C';
      case 'turbidity':
        return '< 1 NTU';
      case 'ph':
        return '6.5-8.5';
      default:
        return '';
    }
  };

  const getProgressPercentage = (type, value, status) => {
    const ranges = {
      tds: { max: 1000, excellent: 300, good: 600, warning: 900 },
      temperature: { max: 50, excellent: 25, good: 30, warning: 35 },
      turbidity: { max: 20, excellent: 1, good: 4, warning: 10 },
      ph: { max: 14, excellent: 8.5, good: 9, warning: 9.5 }
    };
    
    const range = ranges[type];
    if (!range) return 0;
    
    return Math.min(100, (value / range.max) * 100);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-0 p-5 sm:p-7 transition-all duration-300 shadow-xl backdrop-blur-md bg-white/70 dark:bg-gray-800/70 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 hover:scale-[1.025] hover:shadow-2xl font-sans`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        border: '1.5px solid rgba(255,255,255,0.12)',
      }}
    >
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 w-full h-1.5 ${getProgressColor(status)} rounded-t-xl opacity-80`}></div>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-xl ${getStatusColor(status)} bg-opacity-15 bg-gradient-to-br from-white/60 dark:from-gray-700/60 to-transparent shadow-inner`}>
            {getIcon(type)}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-tight font-sans">
              {t(`metrics.${type}`)}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 font-sans">
              {t(`metrics.units.${type}`)}
            </p>
          </div>
        </div>
        {trend !== undefined && (
          <div className={`text-xl ${getTrendColor(trend)} font-sans`}>{getTrendIcon(trend)}</div>
        )}
      </div>
      {/* Main value display */}
      <div className="mb-5">
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${getStatusColor(status)} font-sans`}>{formatValue(value)}</span>
          <span className="text-base sm:text-lg text-gray-500 dark:text-gray-300 font-medium font-sans">{t(`metrics.units.${type}`)}</span>
        </div>
        {/* Progress bar */}
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(status)}`}
            style={{ width: `${Math.min(100, getProgressPercentage(type, value, status))}%` }}
          ></div>
        </div>
      </div>
      {/* Status and ideal range */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(status)}
            <span className={`text-base font-semibold ${getStatusColor(status)} font-sans`}>{t(`status.${status}`)}</span>
          </div>
        </div>
        <div className="bg-white/60 dark:bg-gray-900/60 rounded-lg p-2 sm:p-3 mt-1 shadow-inner flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-sm font-sans">Ideal Range:</span>
          <span className="text-green-600 dark:text-green-400 font-semibold text-xs sm:text-sm font-sans">{getIdealRange(type)}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard; 