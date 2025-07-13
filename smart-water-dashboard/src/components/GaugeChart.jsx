import React from 'react';
import ReactECharts from 'echarts-for-react';

const COLOR_LEGEND = [
  { color: '#22c55e', label: 'Excellent' },
  { color: '#3b82f6', label: 'Good' },
  { color: '#f59e0b', label: 'Warning' },
  { color: '#ef4444', label: 'Danger' },
];

const getGaugeOption = (type, value, label, modal = false) => {
  // Four color zones for each metric
  let min = 0, max = 100, color = [], unit = '';
  switch (type) {
    case 'tds':
      min = 0; max = 1200; unit = 'ppm';
      color = [
        [300/1200, '#22c55e'], // excellent
        [600/1200, '#3b82f6'], // good
        [900/1200, '#f59e0b'], // warning
        [1, '#ef4444'] // danger
      ];
      break;
    case 'temperature':
      min = 0; max = 50; unit = '°C';
      color = [
        [25/50, '#22c55e'],
        [30/50, '#3b82f6'],
        [35/50, '#f59e0b'],
        [1, '#ef4444']
      ];
      break;
    case 'turbidity':
      min = 0; max = 20; unit = 'NTU';
      color = [
        [1/20, '#22c55e'],
        [4/20, '#3b82f6'],
        [10/20, '#f59e0b'],
        [1, '#ef4444']
      ];
      break;
    case 'ph':
    default:
      min = 0; max = 14; unit = '';
      color = [
        [6.5/14, '#22c55e'], // excellent
        [8.5/14, '#3b82f6'], // good
        [9.5/14, '#f59e0b'], // warning
        [1, '#ef4444'] // danger
      ];
      break;
  }
  return {
    series: [
      {
        type: 'gauge',
        min,
        max,
        axisLine: {
          lineStyle: {
            width: modal ? 32 : 14,
            color
          }
        },
        pointer: {
          itemStyle: {
            color: modal ? '#888' : '#2563eb', // Neutral in modal
            shadowColor: 'transparent',
            shadowBlur: 0
          },
          width: modal ? 10 : 4,
          length: '70%'
        },
        progress: {
          show: !modal, // Hide progress bar in modal
          width: modal ? 32 : 14,
          itemStyle: { color: 'transparent' }
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: {
          show: true,
          showAbove: true,
          size: modal ? 22 : 10,
          itemStyle: {
            borderWidth: 1,
            borderColor: modal ? '#888' : '#2563eb',
            color: '#fff',
            shadowBlur: 1,
            shadowColor: 'transparent'
          }
        },
        title: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: modal ? 48 : 18,
          fontWeight: modal ? '700' : '600',
          color: modal ? '#222' : '#2563eb',
          offsetCenter: [0, modal ? '95%' : '80%'], // Move value further below the gauge
          formatter: (val) => `${Number(val).toFixed(2)}${unit}`,
          width: modal ? 300 : 90,
          overflow: 'truncate',
        },
        data: [
          {
            value: value,
            name: label
          }
        ]
      }
    ]
  };
};

const GaugeChart = ({ type, value, label, onClick, modal = false }) => {
  // Responsive modal sizing
  if (modal) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full flex items-center justify-center">
          <ReactECharts
            option={getGaugeOption(type, value, label, true)}
            style={{ height: window.innerWidth < 640 ? '220px' : '340px', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
        <div className="mt-1 text-base text-gray-700 dark:text-gray-200 font-semibold">{label}</div>
        <div className="flex gap-2 mt-2">
          {COLOR_LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: item.color }}></span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  const chartStyle = { height: '160px', width: '100%' };
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center cursor-pointer`} onClick={onClick}>
      <ReactECharts
        option={getGaugeOption(type, value, label, false)}
        style={chartStyle}
        opts={{ renderer: 'svg' }}
      />
      <div className="mt-1 text-xs text-gray-700 dark:text-gray-200 font-semibold">{label}</div>
      <div className="flex gap-2 mt-2">
        {COLOR_LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: item.color }}></span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GaugeChart; 