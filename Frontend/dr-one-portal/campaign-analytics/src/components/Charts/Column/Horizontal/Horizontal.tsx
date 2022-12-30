import React, { useRef, useLayoutEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Grid } from '@material-ui/core'
import { useTranslation } from 'react-i18next';
import { Colors } from "@dr-one/utils";
// charts library
// import * as am4core from '@amcharts/amcharts4/core'
// import * as am4charts from '@amcharts/amcharts4/charts'
// import am4themes_material from '@amcharts/amcharts4/themes/material'
// import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import { Bar } from 'react-chartjs-2';
//utils
import { CreateRandomIdChart } from '../../Utils'
// import { BAR_COLORS } from '../../Utils/constants'
import * as S from "./Horizontal.style";
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

const useStyles = makeStyles({
  containerChart: {
    display: 'flex',
    height: '100px',
    flexDirection: 'column',
    width: '100%',
  },
})

interface Props {
  data?: any
}

function buildDataset(CTRValue: number, campaignType: string, campaignContainerType: string) {
  const chartDataArray = [];
  const chartValue = [CTRValue];

  chartValue.forEach((item, index) => {
    chartDataArray.push({
      backgroundColor: [(campaignType === 'PUSH' || campaignContainerType === 'PUSH') ? Colors.BLUE : "#ffc5ae"],
      data: chartValue,
      barThickness: 15,
      maxBarThickness: 15,
      barPercentage: 1,
      categoryPercentage: 1,
      // label: item,
      borderRadius: 10
    })
  });
  return chartDataArray;
}

const options: any = {
  indexAxis: 'y' as const,
  maintainAspectRatio: false,
  cornerRadius: 55,
  responsive: true,
  scales: {
    x: {
      max: 100,
      min: 0,
      grid: {
        display: true,
        drawBorder: true,
        zeroLineBorderDash: [6],
        zeroLineBorderDashOffset: [0],
        borderDash: [6]
      },
      ticks: {
        stepSize: 25,
        callback: function (value, index, ticks) {
          return value + '%';
        }
      }
    }
  },
  plugins: {
    legend: {
      position: false
    }
  },
};

const Horizontal: React.FC<Props> = ({ data }) => {
  const chart: any = useRef(null)
  const [idChart] = useState(CreateRandomIdChart('HorizontalBar'))
  const [idExternalLegend] = useState(CreateRandomIdChart('legend'))
  const classes = useStyles()
  const { t } = useTranslation();

  let impressions, clicks;
  if (data.campaignType === 'PUSH') {
    clicks = data?.campaignmeterics?.clicks;
    impressions = data?.campaignmeterics?.impressions;
  } else if (data.campaignType === 'INAPP') {
    clicks = data?.campaignmeterics?.clicks;
    impressions = data?.campaignmeterics?.adContainerShown;
  } else if (data.campaignType === 'PUSH_INAPP') {
    if (data.campaignContainerType === 'PUSH') {
      clicks = data?.campaignmeterics?.adContainerShown;
      impressions = data?.campaignmeterics?.impressions;
    } else {
      clicks = data?.campaignmeterics?.clicks;
      impressions = data?.campaignmeterics?.adContainerShown;
    }
  }

  const CTRValue = Math.floor((clicks / impressions) * 100) || 0;

  const chartData = {
    labels: [''],
    datasets: buildDataset(CTRValue, data.campaignType, data.campaignContainerType)
  };
  const exportAPI = (format: string) => {
    if (chart?.current) {
      //@ts-ignore
      chart.current.exporting.export(format)
    }
  }

  // useLayoutEffect(() => {
  //   am4core.useTheme(am4themes_animated)
  //   am4core.useTheme(am4themes_material)
  //   // am4core.addLicense("ch-custom-attribution");
  //   let x = am4core.create(idChart, am4charts.XYChart);

  //   // Add data
  //   x.data = [
  //     {
  //       category: 'CTR',
  //       value: CTRValue,
  //       color: am4core.color((data.campaignType === 'INAPP' || data.campaignContainerType === 'INAPP') ? BAR_COLORS[0]
  //         : BAR_COLORS[1]),
  //     }
  //   ]

  //   const categoryAxis = x.yAxes.push(new am4charts.CategoryAxis())
  //   categoryAxis.dataFields.category = 'category'
  //   categoryAxis.renderer.grid.template.location = 0
  //   categoryAxis.renderer.labels.template.disabled = true
  //   categoryAxis.renderer.grid.template.disabled = true
  //   categoryAxis.renderer.cellStartLocation = 0.5
  //   categoryAxis.renderer.cellEndLocation = 0.5
  //   categoryAxis.renderer.height = 0
  //   categoryAxis.renderer.labels.template.wrap = true
  //   categoryAxis.renderer.cellStartLocation = 0
  //   categoryAxis.cursorTooltipEnabled = false
  //   categoryAxis.fontWeight = '100'

  //   const valueAxis = x.xAxes.push(new am4charts.ValueAxis())
  //   valueAxis.min = 0
  //   valueAxis.max = 112
  //   valueAxis.strictMinMax = true
  //   valueAxis.calculateTotals = true
  //   valueAxis.renderer.minGridDistance = 50
  //   valueAxis.cursorTooltipEnabled = false
  //   valueAxis.renderer.grid.template.strokeOpacity = 0.15
  //   valueAxis.renderer.grid.template.strokeDasharray = '5,5'
  //   valueAxis.renderer.labels.template.adapter.add('text', function (text) {
  //     return `${text}%`
  //   })

  //   const series = x.series.push(new am4charts.ColumnSeries())
  //   series.dataFields.valueX = 'value'
  //   series.dataFields.categoryY = 'category'
  //   series.name = 'value'
  //   series.columns.template.width = am4core.percent(100)
  //   series.columns.template.height = am4core.percent(40)
  //   series.columns.template.column.cornerRadiusTopLeft = 10
  //   series.columns.template.column.cornerRadiusTopRight = 10
  //   series.columns.template.column.cornerRadiusBottomLeft = 10
  //   series.columns.template.column.cornerRadiusBottomRight = 10
  //   series.columns.template.propertyFields.fill = 'color'
  //   series.tooltipText = '{category}: [bold]{value}[/]'
  //   series.strokeOpacity = 0
  //   series.strokeWidth = 0
  //   series.reverseOrder = true
  //   series.fill = am4core.color(`${Colors.BLACK}`)

  //   // Add cursor
  //   x.cursor = new am4charts.XYCursor()
  //   x.cursor.behavior = 'none'
  //   x.cursor.lineX.disabled = true;
  //   x.cursor.lineY.disabled = true;

  //   /* Create legend */
  //   x.legend = new am4charts.Legend()
  //   x.legend.position = "right";
  //   x.legend.valign = "top";
  //   x.legend.visible = false;

  //   /*Create a separate container to put legend in */
  //   var legendContainer = am4core.create(idExternalLegend, am4core.Container)
  //   legendContainer.width = am4core.percent(100)
  //   legendContainer.height = am4core.percent(100)
  //   x.legend.parent = legendContainer
  //   x.legend.scrollable = true

  //   let label = legendContainer.createChild(am4core.Label);
  //   label.html = `
  //       <div style='display: flex; flex-direction: column; align-items: flex-start; justify-content: center'>
  //         <span style='
  //           margin-top: 5px;
  //           color: ${Colors.FADEGRAY};
  //           font-size: 20px;
  //         '>${t('CTR')}</span>

  //         <span
  //         style='
  //           margin-top: 5px;
  //           color: ${Colors.HEADERCOLOR};
  //           font-size: 20px;
  //           font-weight: bold;
  //         '> ${CTRValue} % </span>
  //       </div>`;

  //   label.fontSize = 14;
  //   label.align = "left";
  //   label.isMeasured = false;
  //   label.x = am4core.percent(5);
  //   label.y = am4core.percent(10);

  //   // let label2 = legendContainer.createChild(am4core.Label);
  //   // label2.html = `<div style='display: flex; flex-direction: column; align-items: flex-start; justify-content: center'><div style='height: 5px; width: 20px; background-color: ${BAR_COLORS[1]}; border-radius: 5px;'></div> <span style='margin-top: 5px'>Impressions</span></div>`;
  //   // label2.fontSize = 14;
  //   // label2.align = "left";
  //   // label2.isMeasured = false;
  //   // label2.x = am4core.percent(5);
  //   // label2.y = am4core.percent(60);

  //   x.paddingTop = 0
  //   x.paddingBottom = 0
  //   x.paddingLeft = 10
  //   x.paddingRight = -20
  //   chart.current = x

  //   return () => {
  //     x.dispose()
  //   }
  // }, [data, idChart])

  return (
    <S.Container className="ctr-text">
      <p>CTR <span>{CTRValue} %</span></p>
      <div className="container-chart">
        <Bar data={chartData} options={options} />
      </div>
    </S.Container>

    // <Grid container >
    //   <S.ContainerHorizontal>
    //     <Grid item xs={12} md={10}>
    //       <div id={idChart} className={classes.containerChart} />

    //     </Grid>
    //     <Grid item xs={12} md={2} id={idExternalLegend} style={{ maxHeight: '110px' }}>

    //     </Grid>
    //   </S.ContainerHorizontal>
    // </Grid>
  )
}

export default Horizontal;
