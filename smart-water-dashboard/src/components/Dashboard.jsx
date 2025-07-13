import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Header from './Header';
import MetricCard from './MetricCard';
import RealTimeChart from './RealTimeChart';
import WaterQualityOverview from './WaterQualityOverview';
import AlertsPanel from './AlertsPanel';
import firebaseService from '../services/firebase';
import GaugeChart from './GaugeChart';
import { getGeminiWaterReport } from '../services/gemini';

const SENSOR_KEYS = ['tds', 'temperature', 'turbidity', 'ph'];

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
  const [selectedSensors, setSelectedSensors] = useState(SENSOR_KEYS);
  const [expandedGauge, setExpandedGauge] = useState(null);
  // Gemini report state
  const [geminiReport, setGeminiReport] = useState('');
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [geminiError, setGeminiError] = useState('');
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);

  // Settings modal state and handlers
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempSensors, setTempSensors] = useState(selectedSensors);
  const handleOpenSettings = () => {
    setTempSensors(selectedSensors);
    setIsSettingsOpen(true);
  };
  const handleSensorToggle = (sensor) => {
    setTempSensors((prev) =>
      prev.includes(sensor)
        ? prev.filter((s) => s !== sensor)
        : [...prev, sensor]
    );
  };
  const handleSaveSensors = () => {
    setIsSettingsOpen(false);
    setSelectedSensors(tempSensors);
  };

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
    ].filter(metric => selectedSensors.includes(metric.type));
  }, [sensorData, selectedSensors]);

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

  // Remove handleGeminiReport and button, use effect instead
  // Add back the manual handler
  const handleGeminiReport = async () => {
    if (!sensorData) return;
    setIsGeminiLoading(true);
    setGeminiError('');
    setGeminiReport('');
    try {
      const report = await getGeminiWaterReport({
        TDS: sensorData.TDS,
        Temperature: sensorData.Temperature,
        Turbidity: sensorData.Turbidity,
        pH: sensorData.pH
      });
      setGeminiReport(report);
    } catch (e) {
      setGeminiError('Could not fetch Gemini report.');
    } finally {
      setIsGeminiLoading(false);
    }
  };

  // Utility to summarize and clean up Gemini report
  function summarizeGeminiReport(report) {
    // Remove markdown stars and extra whitespace
    let text = report.replace(/\*\*|\*/g, '').trim();
    return text;
  }

  // Open the Gemini modal automatically when a new report is generated
  React.useEffect(() => {
    if (geminiReport) setIsGeminiModalOpen(true);
  }, [geminiReport]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          {/* Water Drop Animation */}
          <svg className="mx-auto mb-4 animate-bounce" width="64" height="64" viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="waterDropGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <path
              d="M32 6C32 6 12 30 12 42C12 53.0457 21.9543 62 32 62C42.0457 62 52 53.0457 52 42C52 30 32 6 32 6Z"
              fill="url(#waterDropGradient2)"
              stroke="#2563eb"
              strokeWidth="2"
            />
            <ellipse cx="32" cy="48" rx="12" ry="4" fill="#3b82f6" fillOpacity="0.15" />
            <circle cx="32" cy="40" r="8" fill="#fff" fillOpacity="0.25" />
          </svg>
          {/* Animated Water Wave */}
          <svg className="mx-auto mb-2" width="120" height="24" viewBox="0 0 120 24" fill="none">
            <path className="animate-pulse-slow" d="M0 12 Q 20 24 40 12 T 80 12 T 120 12 V24 H0Z" fill="#3b82f6" fillOpacity="0.2" />
          </svg>
          <p className="mt-4 text-blue-700 dark:text-blue-200 font-semibold animate-pulse">Loading water dashboard...</p>
        </div>
      </div>
    );
  }

  const qualityInfo = getOverallQualityInfo(overallQuality);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <Header
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        selectedSensors={selectedSensors}
        onSensorChange={setSelectedSensors}
        onOpenSettings={handleOpenSettings}
      />
      {/* Settings Modal rendered at top level */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg> Customize Dashboard
            </h2>
            <div className="space-y-3 mb-6">
              {SENSOR_KEYS.map((key) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSensors.includes(key)}
                    onChange={() => handleSensorToggle(key)}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{t(`metrics.${key}`)}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSensors}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 font-sans">
        {/* Overall Water Quality Status */}
        <div
          className={`mb-6 sm:mb-8 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-0 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 flex items-center ${qualityInfo.bgColor}`}
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
            border: '1.5px solid rgba(255,255,255,0.12)',
          }}
        >
          <div className="flex items-center space-x-4 w-full">
            <div className="flex-shrink-0">{qualityInfo.icon}</div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-1 font-sans">
                Overall Water Quality: <span className={qualityInfo.color}>{t(`status.${overallQuality}`)}</span>
              </h2>
              <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200 font-sans">
                {qualityInfo.message}
              </p>
            </div>
            <div className="hidden sm:block">
              <Info className="h-5 w-5 text-gray-400 dark:text-gray-300" />
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
        {/* Gemini Water Quality Report */}
        <div className="mb-8 flex flex-col items-center">
          <button
            onClick={handleGeminiReport}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60"
            disabled={isGeminiLoading || !sensorData}
          >
            {isGeminiLoading ? 'Generating Report...' : 'Get AI Water Quality Report'}
          </button>
          {geminiError && <div className="mt-3 text-red-600 font-medium">{geminiError}</div>}
          {geminiReport && isGeminiModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in" onClick={() => setIsGeminiModalOpen(false)}>
              <div className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 rounded-xl sm:rounded-3xl shadow-2xl border border-blue-200 dark:border-blue-800 w-[99vw] max-w-[99vw] sm:w-[90vw] sm:max-w-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <button className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 text-2xl sm:text-3xl font-bold rounded-full bg-white/70 dark:bg-gray-800/70 p-1.5 sm:p-2 shadow-md transition-all duration-200 z-10" onClick={() => setIsGeminiModalOpen(false)}>&times;</button>
                <div className="overflow-y-auto px-4 py-6 sm:px-10 sm:py-12 w-full max-h-[80vh] sm:max-h-[75vh] flex flex-col items-center">
                  <h2 className="text-lg sm:text-2xl font-extrabold mb-4 text-blue-700 dark:text-blue-300 tracking-tight font-sans text-center">Gemini Water Quality Report</h2>
                  <div className="whitespace-pre-line text-sm sm:text-lg text-gray-900 dark:text-gray-100 leading-relaxed max-w-full sm:max-w-2xl mx-auto text-center font-sans">
                    {summarizeGeminiReport(geminiReport)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Gauge Charts for all selected metrics */}
        {sensorData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {selectedSensors.includes('tds') && (
              <GaugeChart type="tds" value={sensorData.TDS} label="TDS" onClick={() => setExpandedGauge('tds')} />
            )}
            {selectedSensors.includes('temperature') && (
              <GaugeChart type="temperature" value={sensorData.Temperature} label="Temperature" onClick={() => setExpandedGauge('temperature')} />
            )}
            {selectedSensors.includes('turbidity') && (
              <GaugeChart type="turbidity" value={sensorData.Turbidity} label="Turbidity" onClick={() => setExpandedGauge('turbidity')} />
            )}
            {selectedSensors.includes('ph') && (
              <GaugeChart type="ph" value={sensorData.pH} label="pH Level" onClick={() => setExpandedGauge('ph')} />
            )}
          </div>
        )}
        {/* Gauge Modal */}
        {expandedGauge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in" onClick={() => setExpandedGauge(null)}>
            <div className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 rounded-xl sm:rounded-3xl shadow-2xl border border-blue-200 dark:border-blue-800 w-[99vw] max-w-[99vw] sm:w-[90vw] sm:max-w-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 text-2xl sm:text-3xl font-bold rounded-full bg-white/70 dark:bg-gray-800/70 p-1.5 sm:p-2 shadow-md transition-all duration-200 z-10" onClick={() => setExpandedGauge(null)}>&times;</button>
              <div className="overflow-y-auto px-4 py-6 sm:px-10 sm:py-12 w-full max-h-[80vh] sm:max-h-[75vh] flex flex-col items-center">
                <div className="flex-1 flex items-center justify-center w-full">
                  <GaugeChart
                    type={expandedGauge}
                    value={
                      expandedGauge === 'tds' ? sensorData.TDS :
                      expandedGauge === 'temperature' ? sensorData.Temperature :
                      expandedGauge === 'turbidity' ? sensorData.Turbidity :
                      expandedGauge === 'ph' ? sensorData.pH : 0
                    }
                    label={
                      expandedGauge === 'tds' ? 'TDS' :
                      expandedGauge === 'temperature' ? 'Temperature' :
                      expandedGauge === 'turbidity' ? 'Turbidity' :
                      expandedGauge === 'ph' ? 'pH Level' : ''
                    }
                    modal={true}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center w-full font-sans">Click outside or × to close</div>
              </div>
            </div>
          </div>
        )}

        {/* Water Quality Standards Reference */}
        <div className="mb-6 sm:mb-8 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 font-sans">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 tracking-tight font-sans">
            Water Quality Standards Reference
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: 'tds', label: 'Total Dissolved Solids', ranges: ['< 300 ppm', '300-600 ppm', '600-900 ppm', '> 900 ppm'] },
              { type: 'temperature', label: 'Temperature', ranges: ['20-25°C', '15-30°C', '10-15°C or 30-35°C', '< 10°C or > 35°C'] },
              { type: 'turbidity', label: 'Turbidity', ranges: ['< 1 NTU', '1-4 NTU', '4-10 NTU', '> 10 NTU'] },
              { type: 'ph', label: 'pH Level', ranges: ['6.5-8.5', '6.0-9.0', '5.5-6.0 or 9.0-9.5', '< 5.5 or > 9.5'] }
            ].map((param) => (
              <div key={param.type} className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-base mb-2 font-sans">{param.label}</h4>
                <div className="space-y-2">
                  {param.ranges.map((range, index) => {
                    const colors = [
                      'text-green-700 dark:text-green-200',
                      'text-blue-700 dark:text-blue-200',
                      'text-yellow-700 dark:text-yellow-200',
                      'text-red-700 dark:text-red-200'
                    ];
                    const bgColors = [
                      'bg-green-100 dark:bg-green-800/60',
                      'bg-blue-100 dark:bg-blue-800/60',
                      'bg-yellow-100 dark:bg-yellow-800/60',
                      'bg-red-100 dark:bg-red-800/60'
                    ];
                    const borderColors = [
                      'border-green-200 dark:border-green-600',
                      'border-blue-200 dark:border-blue-600',
                      'border-yellow-200 dark:border-yellow-600',
                      'border-red-200 dark:border-red-600'
                    ];
                    const statuses = ['excellent', 'good', 'warning', 'danger'];
                    return (
                      <div
                        key={index}
                        className={`text-xs sm:text-sm px-3 py-2 rounded-lg font-medium shadow-sm border ${bgColors[index]} ${colors[index]} ${borderColors[index]} transition-colors`}
                      >
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
          {/* Water Quality Overview (show if any sensor is selected) */}
          {selectedSensors.length > 0 && (
            <div className="xl:col-span-1">
              <WaterQualityOverview data={sensorData} />
            </div>
          )}
          {/* Alerts Panel (always show) */}
          <div className="xl:col-span-1">
            <AlertsPanel data={sensorData} />
          </div>
          {/* Real-time Temperature Chart */}
          {selectedSensors.includes('temperature') && (
            <div className="xl:col-span-1">
              <RealTimeChart
                data={historicalData.temperature}
                type="temperature"
                title={t('charts.temperatureTrends')}
              />
            </div>
          )}
        </div>
        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {selectedSensors.includes('tds') && (
            <RealTimeChart
              data={historicalData.tds}
              type="tds"
              title={t('charts.realTimeData') + ' - TDS'}
            />
          )}
          {selectedSensors.includes('turbidity') && (
            <RealTimeChart
              data={historicalData.turbidity}
              type="turbidity"
              title={t('charts.turbidityAnalysis')}
            />
          )}
        </div>
        {/* pH Chart */}
        {selectedSensors.includes('ph') && (
          <div className="mb-6">
            <RealTimeChart
              data={historicalData.ph}
              type="ph"
              title={t('charts.phLevels')}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;