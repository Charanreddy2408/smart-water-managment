import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AlertsPanel = ({ data }) => {
  const { t } = useTranslation();

  const alerts = useMemo(() => {
    if (!data) return [];

    const alertList = [];
    
    // TDS alerts
    if (data.TDS > 900) {
      alertList.push({
        id: 'tds-high',
        type: 'danger',
        message: t('alerts.highTds'),
        value: data.TDS,
        unit: 'ppm',
        timestamp: new Date()
      });
    } else if (data.TDS > 600) {
      alertList.push({
        id: 'tds-warning',
        type: 'warning',
        message: t('alerts.highTds'),
        value: data.TDS,
        unit: 'ppm',
        timestamp: new Date()
      });
    }

    // pH alerts
    if (data.pH < 5.5 || data.pH > 9.5) {
      alertList.push({
        id: 'ph-danger',
        type: 'danger',
        message: t('alerts.lowPh'),
        value: data.pH,
        unit: '',
        timestamp: new Date()
      });
    } else if ((data.pH >= 5.5 && data.pH < 6.0) || (data.pH > 9.0 && data.pH <= 9.5)) {
      alertList.push({
        id: 'ph-warning',
        type: 'warning',
        message: t('alerts.lowPh'),
        value: data.pH,
        unit: '',
        timestamp: new Date()
      });
    }

    // Turbidity alerts
    if (data.Turbidity > 10) {
      alertList.push({
        id: 'turbidity-high',
        type: 'danger',
        message: t('alerts.highTurbidity'),
        value: data.Turbidity,
        unit: 'NTU',
        timestamp: new Date()
      });
    } else if (data.Turbidity > 4) {
      alertList.push({
        id: 'turbidity-warning',
        type: 'warning',
        message: t('alerts.highTurbidity'),
        value: data.Turbidity,
        unit: 'NTU',
        timestamp: new Date()
      });
    }

    // Temperature alerts
    if (data.Temperature < 10 || data.Temperature > 35) {
      alertList.push({
        id: 'temperature-danger',
        type: 'danger',
        message: t('alerts.temperatureAlert'),
        value: data.Temperature,
        unit: '°C',
        timestamp: new Date()
      });
    } else if ((data.Temperature >= 10 && data.Temperature < 15) || (data.Temperature > 30 && data.Temperature <= 35)) {
      alertList.push({
        id: 'temperature-warning',
        type: 'warning',
        message: t('alerts.temperatureAlert'),
        value: data.Temperature,
        unit: '°C',
        timestamp: new Date()
      });
    }

    return alertList;
  }, [data, t]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{t('alerts.title')}</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="ml-2 text-sm text-gray-600">{t('status.online')}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">{t('alerts.noAlerts')}</p>
            </div>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${getAlertBgColor(alert.type)}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {alert.message}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {t(`status.${alert.type}`)} - {alert.value} {alert.unit}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(alert.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPanel; 