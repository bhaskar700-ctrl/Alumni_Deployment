import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import Modal from 'react-modal';

const ChartsSection = ({ 
  isBarChartOpen, 
  setIsBarChartOpen, 
  isLineChartOpen, 
  setIsLineChartOpen, 
  filter, 
  setFilter, 
  barChartData, 
  lineChartData 
}) => {
  console.log('barChartData:', barChartData); // Log the received data
  console.log('lineChartData:', lineChartData); // Log the received data

  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const barChartModalRef = useRef(null);
  const lineChartModalRef = useRef(null);

  const barChartCategories = barChartData.map(item => item.date);
  const barChartSeriesData = barChartData.map(item => item.totalAmount);
  
  const lineChartCategories = lineChartData.map(item => item.date);
  const lineChartSeriesData = lineChartData.map(item => item.totalAmount);

  const MIN_WIDTH_PER_BAR = 30;
  const minWidth = Math.max(barChartCategories.length * MIN_WIDTH_PER_BAR, 300);

  const barChartConfig = {
    series: [{ name: 'Donations', data: barChartSeriesData }],
    chart: {
      type: 'bar',
      height: 240,
      width: minWidth,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    title: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#1F2937'],
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: barChartCategories,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: true,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
      },
    },
    grid: {
      show: true,
      borderColor: '#E5E7EB',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: 'dark',
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          chart: {
            height: 300,
          },
          xaxis: {
            labels: {
              rotate: -90,
              rotateAlways: true,
            },
          },
        },
      },
    ],
  };

  const lineChartConfig = {
    series: [{ name: 'Donations', data: lineChartSeriesData }],
    chart: {
      type: 'line',
      height: 240,
      width: minWidth,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    title: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#3B82F6', '#EF4444'],
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: lineChartCategories,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: true,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
      },
    },
    grid: {
      show: true,
      borderColor: '#E5E7EB',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    tooltip: {
      theme: 'dark',
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          chart: {
            height: 300,
          },
          xaxis: {
            labels: {
              rotate: -90,
              rotateAlways: true,
            },
          },
        },
      },
    ],
  };

  useEffect(() => {
    if (barChartRef.current) {
      const barChart = new ApexCharts(barChartRef.current, barChartConfig);
      barChart.render();
      return () => barChart.destroy();
    }
  }, [barChartData]);

  useEffect(() => {
    if (lineChartRef.current) {
      const lineChart = new ApexCharts(lineChartRef.current, lineChartConfig);
      lineChart.render();
      return () => lineChart.destroy();
    }
  }, [lineChartData]);

  useEffect(() => {
    if (isBarChartOpen && barChartModalRef.current) {
      const barChart = new ApexCharts(barChartModalRef.current, {
        ...barChartConfig,
        chart: { ...barChartConfig.chart, height: 400, width: Math.max(barChartCategories.length * MIN_WIDTH_PER_BAR, 600) }
      });
      barChart.render();
      return () => barChart.destroy();
    }
  }, [isBarChartOpen, barChartData]);

  useEffect(() => {
    if (isLineChartOpen && lineChartModalRef.current) {
      const lineChart = new ApexCharts(lineChartModalRef.current, {
        ...lineChartConfig,
        chart: { ...lineChartConfig.chart, height: 400, width: Math.max(lineChartCategories.length * MIN_WIDTH_PER_BAR, 600) }
      });
      lineChart.render();
      return () => lineChart.destroy();
    }
  }, [isLineChartOpen, lineChartData]);

  return (
    <>
      <div
        className="bg-white col-span-4 aspect-w-1 aspect-h-1 flex items-center justify-center rounded-lg shadow-lg cursor-pointer"
        style={{ gridRow: 'span 16', overflowX: 'auto' }} // Enable horizontal scrolling
        onClick={() => setIsBarChartOpen(true)}
      >
        <div ref={barChartRef} className="w-full h-full"></div>
      </div>
      <div
        className="bg-white col-span-4 aspect-w-1 aspect-h-1 flex items-center justify-center rounded-lg shadow-lg cursor-pointer"
        style={{ gridRow: 'span 16', overflowX: 'auto' }} // Enable horizontal scrolling
        onClick={() => setIsLineChartOpen(true)}
      >
        <div ref={lineChartRef} className="w-full h-full"></div>
      </div>

      {/* Modal for Bar Chart */}
      <Modal
        isOpen={isBarChartOpen}
        onAfterOpen={() => {
          if (barChartModalRef.current) {
            const barChart = new ApexCharts(barChartModalRef.current, {
              ...barChartConfig,
              chart: { ...barChartConfig.chart, height: 400, width: Math.max(barChartCategories.length * MIN_WIDTH_PER_BAR, 600) }
            });
            barChart.render();
          }
        }}
        onRequestClose={() => setIsBarChartOpen(false)}
        className="relative bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <button onClick={() => setIsBarChartOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Enlarged Bar Chart</h2>
        <div className="flex justify-between mb-4">
          <button onClick={() => setFilter('day')} className={`py-2 px-4 rounded-lg ${filter === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
            Daily Data
          </button>
          <button onClick={() => setFilter('month')} className={`py-2 px-4 rounded-lg ${filter === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
            Monthly Data
          </button>
          <button onClick={() => setFilter('year')} className={`py-2 px-4 rounded-lg ${filter === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
            Yearly Data
          </button>
        </div>
        <div ref={barChartModalRef} className="w-full h-96" style={{ overflowX: 'auto' }}></div>
      </Modal>

      {/* Modal for Line Chart */}
      <Modal
        isOpen={isLineChartOpen}
        onAfterOpen={() => {
          if (lineChartModalRef.current) {
            const lineChart = new ApexCharts(lineChartModalRef.current, {
              ...lineChartConfig,
              chart: { ...lineChartConfig.chart, height: 400, width: Math.max(lineChartCategories.length * MIN_WIDTH_PER_BAR, 600) }
            });
            lineChart.render();
          }
        }}
        onRequestClose={() => setIsLineChartOpen(false)}
        className="relative bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <button onClick={() => setIsLineChartOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Enlarged Line Chart</h2>
        <div className="flex justify-between mb-4">
          <button onClick={() => setFilter('day')} className={`py-2 px-4 rounded-lg ${filter === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
            Daily Data
          </button>
          <button onClick={() => setFilter('month')} className={`py-2 px-4 rounded-lg ${filter === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
            Monthly Data
          </button>
          <button onClick={() => setFilter('year')} className={`py-2 px-4 rounded-lg ${filter === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
            Yearly Data
          </button>
        </div>
        <div ref={lineChartModalRef} className="w-full h-96" style={{ overflowX: 'auto' }}></div>
      </Modal>
    </>
  );
};

export default ChartsSection;
