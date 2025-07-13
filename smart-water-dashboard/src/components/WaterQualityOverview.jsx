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
        textStyle: {
          color: '#1f2937'
        },
        formatter: (params) => {
          const indicators = ['tds', 'temperature', 'turbidity', 'ph'];
          const actualValues = [data.TDS, data.Temperature, data.Turbidity, data.pH];
          const units = ['ppm', '°C', 'NTU', ''];
          
          let tooltipContent = `${params.name}<br/>`;
          indicators.forEach((indicator, index) => {
            tooltipContent += `${t(`metrics.${indicator}`)}: ${actualValues[index]} ${units[index]}<br/>`;
          });
          
          return tooltipContent;
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: [t('charts.waterQualityOverview')]
      },
      radar: {
        indicator: [
          { name: t('metrics.tds'), max: 100 },
          { name: t('metrics.temperature'), max: 100 },
          { name: t('metrics.turbidity'), max: 100 },
          { name: t('metrics.ph'), max: 100 }
        ],
        center: ['50%', '55%'],
        radius: '60%',
        axisName: {
          color: '#6b7280',
          fontSize: 12
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(114, 172, 209, 0.1)', 'rgba(114, 172, 209, 0.05)']
          }
        },
        splitLine: {
          lineStyle: {
            color: '#e5e7eb'
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
          width: 2
        },
        areaStyle: {
          color: 'rgba(59, 130, 246, 0.1)'
        },
        emphasis: {
          itemStyle: {
            color: '#1d4ed8'
          }
        }
      }]
    };
  }, [data, t]);

  return (
    <div className="card">
      <ReactECharts
        option={option}
        style={{ height: '400px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};

export default WaterQualityOverview; 