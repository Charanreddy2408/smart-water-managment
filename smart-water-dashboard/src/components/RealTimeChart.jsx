import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ReactECharts from 'echarts-for-react';

const RealTimeChart = ({ data, type, title }) => {
  const { t } = useTranslation();

  const option = useMemo(() => {
    const timeData = data.map(item => new Date(item.timestamp).toLocaleTimeString());
    const valueData = data.map(item => item.value);

    const getColor = (type) => {
      switch (type) {
        case 'temperature':
          return '#ef4444';
        case 'tds':
          return '#3b82f6';
        case 'turbidity':
          return '#f59e0b';
        case 'ph':
          return '#10b981';
        default:
          return '#6b7280';
      }
    };

    const getYAxisRange = (type) => {
      const ranges = {
        temperature: { min: -10, max: 50 },
        tds: { min: 0, max: 1200 },
        turbidity: { min: 0, max: 25 },
        ph: { min: 0, max: 14 }
      };
      return ranges[type] || { min: 0, max: 100 };
    };

    const yAxisRange = getYAxisRange(type);

    return {
      title: {
        text: title || t(`charts.${type}Trends`),
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1f2937'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 8,
        textStyle: {
          color: '#1f2937'
        },
        formatter: (params) => {
          const param = params[0];
          const unit = t(`metrics.units.${type}`);
          const value = param.value;
          let status = 'unknown';
          
          // Determine status based on value
          if (type === 'tds') {
            if (value < 300) status = 'excellent';
            else if (value < 600) status = 'good';
            else if (value < 900) status = 'warning';
            else status = 'danger';
          } else if (type === 'temperature') {
            if (value >= 20 && value <= 25) status = 'excellent';
            else if (value >= 15 && value <= 30) status = 'good';
            else if (value >= 10 && value <= 35) status = 'warning';
            else status = 'danger';
          } else if (type === 'turbidity') {
            if (value < 1) status = 'excellent';
            else if (value < 4) status = 'good';
            else if (value < 10) status = 'warning';
            else status = 'danger';
          } else if (type === 'ph') {
            if (value >= 6.5 && value <= 8.5) status = 'excellent';
            else if (value >= 6.0 && value <= 9.0) status = 'good';
            else if (value >= 5.5 && value <= 9.5) status = 'warning';
            else status = 'danger';
          }

          const statusColors = {
            excellent: '#22c55e',
            good: '#3b82f6',
            warning: '#f59e0b',
            danger: '#ef4444'
          };

          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${param.name}</div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: ${statusColors[status]}; font-size: 12px;">●</span>
                <span>${param.seriesName}: <strong>${value} ${unit}</strong></span>
              </div>
              <div style="margin-top: 4px; font-size: 12px; color: ${statusColors[status]};">
                Status: ${t(`status.${status}`)}
              </div>
            </div>
          `;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timeData,
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 11,
          rotate: 45
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        min: yAxisRange.min,
        max: yAxisRange.max,
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 11,
          formatter: (value) => `${value} ${t(`metrics.units.${type}`)}`
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: t(`metrics.${type}`),
          type: 'line',
          data: valueData,
          smooth: true,
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: getColor(type),
            borderWidth: 2,
            borderColor: '#ffffff'
          },
          lineStyle: {
            width: 3,
            color: getColor(type)
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: getColor(type) + '30'
              }, {
                offset: 1,
                color: getColor(type) + '05'
              }]
            }
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              shadowBlur: 10,
              shadowColor: getColor(type)
            }
          }
        }
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };
  }, [data, type, title, t]);

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

export default RealTimeChart; 