// charts library
// import * as am4core from '@amcharts/amcharts4/core';
// import * as am4charts from '@amcharts/amcharts4/charts';
// import am4themes_material from '@amcharts/amcharts4/themes/material';
// import am4themes_animated from '@amcharts/amcharts4/themes/animated';
// import { XYSeries } from '@amcharts/amcharts4/charts';

// global utils for charts
import { DATE_LINE_COLORS } from '../../Utils/constants';

import { SeriesConfig } from '../../Utils/chartsTypes';

export const MakeChartConfig = (
  idChart: string,
  series: SeriesConfig[] = []
) => {
  // am4core.useTheme(am4themes_animated);
  // am4core.useTheme(am4themes_material);
  // let chart = am4core.create(idChart, am4charts.XYChart);

  // // Create axes
  // // date axis "X"
  // const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  // dateAxis.renderer.minGridDistance = 50;
  // dateAxis.renderer.grid.template.location = 0.5;
  // dateAxis.cursorTooltipEnabled = false;
  // dateAxis.margin(20, 0, 5, 0);
  // dateAxis.renderer.grid.template.strokeOpacity = 0;
  // dateAxis.renderer.labels.template.fontSize = 14;

  // // yAxis
  // const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
  // yAxis.min = 0;
  // yAxis.renderer.grid.template.strokeOpacity = 0.08;
  // yAxis.renderer.grid.template.strokeDasharray = '8,8';
  // yAxis.cursorTooltipEnabled = false;
  // yAxis.visible = false;

  // // create and config series
  // series.forEach((value: SeriesConfig, index: number) => {
  //   chart.series.push(createSeries(value, index));
  // });

  // // legend
  // chart.legend = new am4charts.Legend();
  // chart.legend.labels.template.fontSize = 14;
  // chart.legend.useDefaultMarker = true;
  // chart.legend.position = 'bottom';
  // chart.legend.itemContainers.template.togglable = false;
  // chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;
  // const marker: any = chart.legend.markers.template.children.getIndex(0);
  // marker.cornerRadius(50, 50, 50, 50);
  // marker.strokeWidth = 1;
  // marker.strokeOpacity = 0.1;
  // marker.height = 14;
  // marker.width = 14;
  // marker.stroke = am4core.color('#ccc');

  // // cursor
  // chart.cursor = new am4charts.XYCursor();
  // chart.cursor.lineY.disabled = true;
  // chart.cursor.lineX.disabled = true;

  // // Add simple scrollbar
  // chart.scrollbarX = new am4core.Scrollbar();
  // chart.scrollbarX.margin(0, 0, 20, 0);
  // return chart;
};

const createSeries = (seriesName: SeriesConfig, index: number) => {
  // let temp: XYSeries = new am4charts.LineSeries();
  // temp.dataFields.valueY = seriesName.key;
  // temp.name = seriesName.name;
  // temp.dataFields.dateX = 'date';
  // temp.tooltipText = '{name}\n{dateX}: [b]{valueY}[/]';
  // temp.strokeWidth = 2;
  // temp.fill = am4core.color(DATE_LINE_COLORS[index]);
  // @ts-ignore
  // temp.tensionX = 1;
  // @ts-ignore
  // temp.tensionY = 1;
  return temp;
};

export const DUMMY_SERIES_DATELINE: SeriesConfig[] = [
  { key: 'app', name: 'App installed' },
  { key: 'session', name: 'Session started' },
  { key: 'purchase', name: 'Purchase' },
  { key: 'appUni', name: 'App uninstalled' }
];

export const CreateDummyData = (series: SeriesConfig[] = []): any[] => {
  const dummyData: any[] = [];
  const TotalDates: number = Math.floor(Math.random() * (20 - 7)) + 7;
  if (series.length === 0) {
    series = DUMMY_SERIES_DATELINE
  }
  const monthRandom = Math.floor(Math.random() * (12 - 1)) + 1;
  new Array(TotalDates).fill(0).forEach((val: number, index: number) => {
    let tempData: any = {};
    tempData.date = new Date(2021, monthRandom, index + 1);
    series.forEach((x: SeriesConfig) => {
      let renderKey = Math.floor(Math.random() * (10 - 1)) + 1;
      if (!(renderKey % 5 === 0)) {
        tempData[x.key] = Math.floor(Math.random() * (200 - 50)) + 50;
      }
    });
    dummyData.push(tempData);
  });
  return dummyData;
};
