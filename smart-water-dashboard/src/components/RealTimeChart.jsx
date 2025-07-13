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
        textStyle: {
          color: '#1f2937'
        },
        formatter: (params) => {
          const param = params[0];
          const unit = t(`metrics.units.${type}`);
          return `${param.name}<br/>
                  ${param.marker} ${param.seriesName}: ${param.value} ${unit}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
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
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12,
          formatter: (value) => `${value} ${t(`metrics.units.${type}`)}`
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6'
          }
        }
      },
      series: [
        {
          name: t(`metrics.${type}`),
          type: 'line',
          data: valueData,
          smooth: true,
          itemStyle: {
            color: getColor(type)
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
                color: getColor(type) + '20'
              }, {
                offset: 1,
                color: getColor(type) + '05'
              }]
            }
          },
          emphasis: {
            focus: 'series'
          }
        }
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };
  }, [data, type, title, t]);

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

export default RealTimeChart; 