import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { GlobalContext } from '../../context/globalState';
import { useContext } from 'react';
import { Spinner } from '@dr-one/shared-component';
import { Colors } from "@dr-one/utils";
// import { Chart, registerables } from 'chart.js';
// Chart.register(...registerables);
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);
const AnalyticsChart = ({ data: dataProp, labels, ...rest }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { state } = useContext(GlobalContext);

  const chartLineColors = [
    '#1854D1', '#ff5200', '#690369', '#ffc20f', '#7700bd', '#00c21d', '#2F4554', '#FF00FF', '#eb6300', '#a10040'
  ];

  const chartData = {
    labels: labels,
    datasets: buildDataset()
  };

  function buildDataset() {
    const data = [];
    dataProp.forEach((item, index) => {
      // const lineColor = getRandomDarkColor();
      // const lineColor = `${Colors.PRIMARY}`;
      const lineColor = getChartLineColor(index);
      data.push({
        id: index,
        label: item.name,
        data: item.data,
        borderColor: lineColor,
        pointBorderColor: 'white',
        pointHoverBackgroundColor: lineColor,
        pointHoverBorderColor: 'white',
        pointHoverColor: lineColor,
        pointBackgroundColor: lineColor,
        hoverBorderWidth: 8,
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 4,
        tension: 0.3,
        beginAtZero: true
      })
    });
    return data;
  }

  // function getRandomDarkColor() {
  //   let color = "#";
  //   for (let i = 0; i < 3; i++)
  //     color += ("0" + Math.floor(Math.random() * Math.pow(16, 2) / 2).toString(16)).slice(-2);
  //   return color;
  // }

  function getChartLineColor(rowIndex: number = 0) {
    let colorIndex = 0;
    if (rowIndex) {
      let chartLineColorSize = chartLineColors.length;
      if (chartLineColorSize - 1 > rowIndex) {
        colorIndex = rowIndex % chartLineColorSize;
      } else {
        colorIndex = rowIndex;
      }
    }

    return chartLineColors[colorIndex];
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // animation: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          usePointStyle: true,
          boxWidth: 10
        }
      }
    },
    layout: {
      padding: 10
    },
    scales: {
      xAxes: {
        grid: {
          display: false,
          drawBorder: true
        }
      },
      yAxes: {
        grid: {
          borderDash: [6],
          drawBorder: true,
          color: theme.palette.divider,
          zeroLineBorderDash: [6],
          zeroLineBorderDashOffset: [0],
          zeroLineColor: theme.palette.divider,
          display: true
        },
        ticks: {
          beginAtZero: true,
          padding: 15,
          maxTicksLimit: 8
        }
      }
    },
    legend: {
      display: false,
      labels: {
        usePointStyle: true,
        boxWidth: 6
      }
    },
    animation: {
      duration: 0
    }
  };

  return (
    <>
      {((state.analytics.currentTab === 'all' && state.analytics?.all?.chart?.data?.dataY?.length !== 0) ||
        (state.analytics.currentTab === 'channel' && state.analytics?.channel?.chart?.data?.dataY?.length !== 0) ||
        (state.analytics.currentTab === 'device' && state.analytics?.device?.chart?.data?.dataY?.length !== 0) ||
        (state.analytics.currentTab === 'app' && state.analytics?.app?.chart?.data?.dataY?.length !== 0))
        &&
        <div {...rest}>
          <Line data={chartData} options={options} />
        </div>}
      {((state.analytics.currentTab === 'all' && state.analytics.chartAllLoader) || (state.analytics.currentTab === 'channel' && state.analytics.chartChannelLoader) || (state.analytics.currentTab === 'device' && state.analytics.chartDeviceLoader) && (state.analytics.currentTab === 'app' && state.analytics.chartAppLoader)) && <div className="spinner-wrap"><Spinner color={"blue"} /></div>}
      {((state.analytics.currentTab === 'all' && chartData.labels.length === 0 && !state.analytics.chartAllLoader) || (state.analytics.currentTab === 'channel' && chartData.labels.length === 0 && !state.analytics.chartChannelLoader) || (state.analytics.currentTab === 'device' && chartData.labels.length === 0 && !state.analytics.chartDeviceLoader) || (state.analytics.currentTab === 'app' && chartData.labels.length === 0 && !state.analytics.chartAppLoader)) && <div {...rest} className="alert error lg"><div className="alert-message">{t('CAMPAIGN_ANALYTICS_ERROR')}</div></div>}
    </>

  );
};

AnalyticsChart.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired
};

export default AnalyticsChart;
