import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Header from './Header';
import MetricCard from './MetricCard';
import RealTimeChart from './RealTimeChart';
import WaterQualityOverview from './WaterQualityOverview';
import AlertsPanel from './AlertsPanel';
import firebaseService from '../services/firebase';

const Dashboard = () => {
  const { t } = useTranslation();
  const [sensorData, setSensorData] = useState(null);
  const [historicalData, setHistoricalData] = useState({
    temperature: [],
    tds: [],
    turbidity: [],
    ph: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize Firebase listener
  useEffect(() => {
    const unsubscribe = firebaseService.listenToSensorData((data) => {
      if (data) {
        setSensorData(data);
        setLastUpdated(new Date());
        
        // Update historical data (keep last 20 readings)
        const timestamp = new Date().getTime();
        setHistoricalData(prev => ({
          temperature: [...prev.temperature, { timestamp, value: data.Temperature }].slice(-20),
          tds: [...prev.tds, { timestamp, value: data.TDS }].slice(-20),
          turbidity: [...prev.turbidity, { timestamp, value: data.Turbidity }].slice(-20),
          ph: [...prev.ph, { timestamp, value: data.pH }].slice(-20)
        }));
      }
      setIsLoading(false);
    });

    return () => {
      firebaseService.stopListening('sensorData');
    };
  }, []);

  // Refresh data manually
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await firebaseService.getSensorData();
      if (data) {
        setSensorData(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate metric status
  const getMetricStatus = (type, value) => {
    return firebaseService.getParameterStatus(type, value);
  };

  // Prepare metric data
  const metrics = useMemo(() => {
    if (!sensorData) return [];
    
    return [
      {
        type: 'tds',
        value: sensorData.TDS,
        status: getMetricStatus('TDS', sensorData.TDS)
      },
      {
        type: 'temperature',
        value: sensorData.Temperature,
        status: getMetricStatus('Temperature', sensorData.Temperature)
      },
      {
        type: 'turbidity',
        value: sensorData.Turbidity,
        status: getMetricStatus('Turbidity', sensorData.Turbidity)
      },
      {
        type: 'ph',
        value: sensorData.pH,
        status: getMetricStatus('pH', sensorData.pH)
      }
    ];
  }, [sensorData]);

  // Calculate overall water quality
  const overallQuality = useMemo(() => {
    if (!metrics.length) return 'unknown';
    
    const statusPriority = { danger: 4, warning: 3, good: 2, excellent: 1 };
    const worstStatus = metrics.reduce((worst, metric) => {
      return statusPriority[metric.status] > statusPriority[worst] ? metric.status : worst;
    }, 'excellent');
    
    return worstStatus;
  }, [metrics]);

  const getOverallQualityInfo = (status) => {
    const info = {
      excellent: {
        icon: <CheckCircle className="h-6 w-6 text-green-600" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
        message: 'Water quality is excellent and safe for consumption'
      },
      good: {
        icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200',
        message: 'Water quality is good and acceptable for use'
      },
      warning: {
        icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200',
        message: 'Water quality requires attention - monitor closely'
      },
      danger: {
        icon: <Shield className="h-6 w-6 text-red-600" />,
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200',
        message: 'Water quality is poor - immediate action required'
      }
    };
    
    return info[status] || info.excellent;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const qualityInfo = getOverallQualityInfo(overallQuality);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Overall Water Quality Status */}
        <div className={`mb-6 sm:mb-8 rounded-xl border-2 p-4 sm:p-6 ${qualityInfo.bgColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              {qualityInfo.icon}
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Overall Water Quality: <span className={qualityInfo.color}>{t(`status.${overallQuality}`)}</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {qualityInfo.message}
                </p>
              </div>
            </div>
            <div className="hidden sm:block">
              <Info className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.type}
              type={metric.type}
              value={metric.value}
              status={metric.status}
            />
          ))}
        </div>

        {/* Water Quality Standards Reference */}
        <div className="mb-6 sm:mb-8 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Water Quality Standards Reference
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: 'tds', ranges: ['< 300 ppm', '300-600 ppm', '600-900 ppm', '> 900 ppm'] },
              { type: 'temperature', ranges: ['20-25°C', '15-30°C', '10-15°C or 30-35°C', '< 10°C or > 35°C'] },
              { type: 'turbidity', ranges: ['< 1 NTU', '1-4 NTU', '4-10 NTU', '> 10 NTU'] },
              { type: 'ph', ranges: ['6.5-8.5', '6.0-9.0', '5.5-6.0 or 9.0-9.5', '< 5.5 or > 9.5'] }
            ].map((param) => (
              <div key={param.type} className="space-y-2">
                <h4 className="font-semibold text-gray-900">{t(`metrics.${param.type}`)}</h4>
                <div className="space-y-1">
                  {param.ranges.map((range, index) => {
                    const colors = ['text-green-600', 'text-blue-600', 'text-yellow-600', 'text-red-600'];
                    const bgColors = ['bg-green-100', 'bg-blue-100', 'bg-yellow-100', 'bg-red-100'];
                    const statuses = ['excellent', 'good', 'warning', 'danger'];
                    return (
                      <div key={index} className={`text-xs sm:text-sm px-2 py-1 rounded ${bgColors[index]} ${colors[index]}`}>
                        {t(`status.${statuses[index]}`)}: {range}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Water Quality Overview */}
          <div className="xl:col-span-1">
            <WaterQualityOverview data={sensorData} />
          </div>

          {/* Alerts Panel */}
          <div className="xl:col-span-1">
            <AlertsPanel data={sensorData} />
          </div>

          {/* Real-time Temperature Chart */}
          <div className="xl:col-span-1">
            <RealTimeChart
              data={historicalData.temperature}
              type="temperature"
              title={t('charts.temperatureTrends')}
            />
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <RealTimeChart
            data={historicalData.tds}
            type="tds"
            title={t('charts.realTimeData') + ' - TDS'}
          />
          <RealTimeChart
            data={historicalData.turbidity}
            type="turbidity"
            title={t('charts.turbidityAnalysis')}
          />
        </div>

        {/* pH Chart */}
        <div className="mb-6">
          <RealTimeChart
            data={historicalData.ph}
            type="ph"
            title={t('charts.phLevels')}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 