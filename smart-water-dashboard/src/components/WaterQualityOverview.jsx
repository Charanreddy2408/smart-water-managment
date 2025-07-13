import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ReactECharts from 'echarts-for-react';

const WaterQualityOverview = ({ data }) => {
  const { t } = useTranslation();

  const option = useMemo(() => {
    if (!data) return {};

    // Normalize values to 0-100 scale for radar chart
    const normalizeValue = (value, type) => {
      const ranges = {
        tds: { min: 0, max: 1000 },
        temperature: { min: 0, max: 50 },
        turbidity: { min: 0, max: 20 },
        ph: { min: 0, max: 14 }
      };
      
      const range = ranges[type];
      return Math.min(100, Math.max(0, ((value - range.min) / (range.max - range.min)) * 100));
    };

    const radarData = [
      {
        value: [
          normalizeValue(data.TDS || 0, 'tds'),
          normalizeValue(data.Temperature || 0, 'temperature'),
          normalizeValue(data.Turbidity || 0, 'turbidity'),
          normalizeValue(data.pH || 0, 'ph')
        ],
        name: t('charts.waterQualityOverview')
      }
    ];

    return {
      title: {
        text: t('charts.waterQualityOverview'),
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1f2937'
        }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 8,
        textStyle: {
          color: '#1f2937'
        },
        formatter: (params) => {
          const indicators = ['tds', 'temperature', 'turbidity', 'ph'];
          const actualValues = [data.TDS, data.Temperature, data.Turbidity, data.pH];
          const units = ['ppm', '°C', 'NTU', ''];
          
          let tooltipContent = `<div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 8px;">${params.name}</div>`;
          
          indicators.forEach((indicator, index) => {
            const value = actualValues[index];
            let status = 'unknown';
            let statusColor = '#6b7280';
            
            // Determine status
            if (indicator === 'tds') {
              if (value < 300) { status = 'excellent'; statusColor = '#22c55e'; }
              else if (value < 600) { status = 'good'; statusColor = '#3b82f6'; }
              else if (value < 900) { status = 'warning'; statusColor = '#f59e0b'; }
              else { status = 'danger'; statusColor = '#ef4444'; }
            } else if (indicator === 'temperature') {
              if (value >= 20 && value <= 25) { status = 'excellent'; statusColor = '#22c55e'; }
              else if (value >= 15 && value <= 30) { status = 'good'; statusColor = '#3b82f6'; }
              else if (value >= 10 && value <= 35) { status = 'warning'; statusColor = '#f59e0b'; }
              else { status = 'danger'; statusColor = '#ef4444'; }
            } else if (indicator === 'turbidity') {
              if (value < 1) { status = 'excellent'; statusColor = '#22c55e'; }
              else if (value < 4) { status = 'good'; statusColor = '#3b82f6'; }
              else if (value < 10) { status = 'warning'; statusColor = '#f59e0b'; }
              else { status = 'danger'; statusColor = '#ef4444'; }
            } else if (indicator === 'ph') {
              if (value >= 6.5 && value <= 8.5) { status = 'excellent'; statusColor = '#22c55e'; }
              else if (value >= 6.0 && value <= 9.0) { status = 'good'; statusColor = '#3b82f6'; }
              else if (value >= 5.5 && value <= 9.5) { status = 'warning'; statusColor = '#f59e0b'; }
              else { status = 'danger'; statusColor = '#ef4444'; }
            }
            
            tooltipContent += `
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: ${statusColor}; font-size: 12px;">●</span>
                <span style="flex: 1; margin-left: 8px;">${t(`metrics.${indicator}`)}</span>
                <span style="font-weight: bold;">${value} ${units[index]}</span>
              </div>
              <div style="font-size: 11px; color: ${statusColor}; margin-bottom: 8px; margin-left: 20px;">
                ${t(`status.${status}`)}
              </div>
            `;
          });
          
          tooltipContent += `</div>`;
          return tooltipContent;
        }
      },
      legend: {
        show: false
      },
      radar: {
        indicator: [
          { name: t('metrics.tds'), max: 100 },
          { name: t('metrics.temperature'), max: 100 },
          { name: t('metrics.turbidity'), max: 100 },
          { name: t('metrics.ph'), max: 100 }
        ],
        center: ['50%', '55%'],
        radius: '65%',
        axisName: {
          color: '#6b7280',
          fontSize: 12,
          fontWeight: 'bold'
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(59, 130, 246, 0.05)', 'rgba(34, 197, 94, 0.05)', 'rgba(245, 158, 11, 0.05)', 'rgba(239, 68, 68, 0.05)']
          }
        },
        splitLine: {
          lineStyle: {
            color: '#e5e7eb',
            width: 1
          }
        },
        axisLine: {
          lineStyle: {
            color: '#d1d5db'
          }
        }
      },
      series: [{
        name: t('charts.waterQualityOverview'),
        type: 'radar',
        data: radarData,
        itemStyle: {
          color: '#3b82f6'
        },
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        areaStyle: {
          color: 'rgba(59, 130, 246, 0.2)'
        },
        emphasis: {
          itemStyle: {
            color: '#1d4ed8'
          },
          lineStyle: {
            width: 4
          }
        }
      }]
    };
  }, [data, t]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <ReactECharts
        option={option}
        style={{ height: '350px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};

export default WaterQualityOverview; 