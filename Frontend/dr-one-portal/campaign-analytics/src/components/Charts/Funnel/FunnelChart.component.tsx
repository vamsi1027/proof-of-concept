// import { useRef, useEffect, useState } from "react";
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_material from "@amcharts/amcharts4/themes/material";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import SkeletonFunnel from './FunnelSkeleton/FunnelSkeleton.component';
// import LoadingSpinner from '../../LoadingSpinner';
// import NoDataChart from '../NoDataChart';
import * as S from "./FunnelChart.style";
// import {
//   CreateRandomIdChart,
//   DataInLineForFunnel,
//   CreateFunnelColors,
//   CreateFunnelMarginLabels,
// } from "../Utils";
// import { PERCENT_LABELS_COLORS, PERCENT_BACK_COLORS } from "../Utils/constants";
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import { Colors } from "@dr-one/utils";
import { Spinner } from "@dr-one/shared-component";
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

export interface DataForFunnelType {
  name: string;
  value: number;
}

interface Props {
  data?: DataForFunnelType[];
  inlineData?: string[];
  height?: string;
  isLoading?: boolean;
  errorCode?: number
}

const FunnelChart: React.FC<Props> = ({ isLoading = false, data, inlineData, height = "400px", errorCode }) => {
  // const chart: any = useRef(null);
  // const [idChart] = useState(CreateRandomIdChart("funnel"));
  // const [useSkeleton, setUseSkeleton] = useState(true);
  const { t } = useTranslation();

  const chartData = {
    labels: buildLabels(),
    datasets: buildDataset()
  };

  function buildDataset() {
    const chartValue = [];
    data.forEach((item, index) => {
      chartValue.push(item.value)
    });
    return [{
      backgroundColor: ["#FFE7DE", "#FFC5AE", "#B7B7F3", "#818FFE"],
      data: chartValue,
      barThickness: 40,
      maxBarThickness: 40,
      barPercentage: 1,
      categoryPercentage: 1,
    }]
  }

  function buildLabels() {
    const labels = [];
    data.forEach((item, index) => {
      labels.push(item.name)
    });
    return labels;
  }

  const options: any = {
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    cornerRadius: 55,
    scales: {
      xAxes: {
        grid: {
          display: true,
          drawBorder: true,
          zeroLineBorderDash: [6],
          zeroLineBorderDashOffset: [0],
          borderDash: [6]
        }
      },
      yAxes: {
        grid: {
          display: false
        }
      }
    },
    responsive: true,
    plugins: {
      // legend: {
      //   position: 'right' as const,
      // },
      legend: {
        position: false
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: function (context) {
            return context.raw;
          }
        }
      }
    }
  };

  // useEffect(() => {
  //   if (data) {
  //     am4core.useTheme(am4themes_animated);
  //     am4core.useTheme(am4themes_material);
  //     // am4core.addLicense('ch-custom-attribution');
  //     let x = am4core.create(idChart, am4charts.SlicedChart);
  //     const dataForChart: any = data || DataInLineForFunnel(inlineData || []);
  //     const dataLength: number = dataForChart.length;
  //     x.data = dataForChart;

  //     if (dataLength) {
  //       let series = x.series.push(new am4charts.FunnelSeries());
  //       series.dataFields.value = "value";
  //       series.dataFields.category = "name";
  //       series.alignLabels = true;
  //       series.labelsOpposite = false;
  //       series.labels.template.html = `<span>{category}</span>`;
  //       //series.labels.template.hidden = true
  //       series.ticks.template.strokeOpacity = 0.15;
  //       series.ticks.template.strokeDasharray = "5,5";
  //       series.ticks.template.strokeWidth = 0.5;
  //       series.sliceLinks.template.height = x.data.length > 4 ? 15 : 25;
  //       series.ticks.template.locationX = 100;
  //       series.ticks.template.locationY = 0;
  //       series.slices.template.tooltipText = "{category}: {value.value}";
  //       series.colors.list = CreateFunnelColors(dataForChart.length);
  //       x.legend = new am4charts.Legend();
  //       x.legend.markers.template.disabled = false;
  //       x.legend.position = "right";
  //       x.legend.labels.template.text = "[/]";
  //       x.legend.valign = "top";
  //       x.legend.margin(0, 0, 0, 0);
  //       x.legend.visible = false;

  //       let lenghtY: number = Math.round(100 / dataLength)
  //       //@ts-ignore
  //       const max: number = dataForChart.reduce(
  //         (acc: any, shot: any) => (acc = acc > shot.value ? acc : shot.value),
  //         0
  //       );
  //       dataForChart.forEach((value: any, index: any) => {
  //         let label = x.createChild(am4core.Label);
  //         // create custom html
  //         let color = PERCENT_LABELS_COLORS[index];
  //         let backGround = PERCENT_BACK_COLORS[index];
  //         let percentCalc: string = (max > 0) ? "100" : "0";
  //         if (index > 0 && max > 0) {
  //           percentCalc = Math.round((value.value / max) * 100).toString();
  //         }
  //         const labelRest: number = (height === '400px') ? 12 : 7
  //         label.html = `<div style='background-color: ${backGround}; padding: 7px; text-align: center; border-radius: 5px;'><span style='font-weight: 700; color: ${color}'>${percentCalc}%</span></div>`;
  //         label.fontSize = 10;
  //         label.align = "left";
  //         label.isMeasured = false;
  //         label.x = am4core.percent(90);
  //         label.y = am4core.percent(lenghtY * (index + 1) - labelRest);
  //       });

  //       x.legend.margin(0, 0, 0, 20);

  //       let marginLabels: string = CreateFunnelMarginLabels(dataLength);
  //       x.legend.labels.template.html = `<p style='margin-top: ${marginLabels}'>&nbsp;</p>`;
  //     }

  //     chart.current = x;
  //     // setUseSkeleton(false);
  //   }
  //   return () => {
  //     if (chart.current) {
  //       chart.current.dispose();
  //     }
  //   };
  // }, [data, inlineData, idChart, isLoading]);

  const showFunnel = (): boolean => {
    if (window.location.pathname.indexOf('PUSH_INAPP') > 0) {
      if (errorCode === null) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  return (
    (isLoading)
      ?
      <S.Container className="chart-loader">
        <Spinner color={"blue"} />
      </S.Container>
      :
      <S.Container>
        {(data.length === 0 && !isLoading && errorCode === 404 && window.location.pathname.indexOf('PUSH_INAPP') < 0) && <div className="analytics-no-data">
          <div className="analytics-no-data-content">
            <img src="/img/campaign-analytics-no-data.svg" />
            <img src="/img/campaign-analytics-no-data-text.svg" />
          </div>
        </div>}
        {
          (data.length === 0 && !isLoading && errorCode !== 404)
          && <p className='analytics-error'>{t('CAMPAIGN_ANALYTICS_ERROR')}</p>
        }
        {/* {showFunnel() && <div id={idChart} className="funnel" />} */}
        {(showFunnel() && data.length !== 0) && <div className="funnel"><Bar data={chartData} options={options} /></div>}
      </S.Container>
  )
};

export default FunnelChart;
