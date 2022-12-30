import "./styles.css";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import * as am4core from "@amcharts/amcharts4/core";
import React from "react";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import am4themes_material from "@amcharts/amcharts4/themes/material";
import { BAR_COLORS } from "../../../Utils/constants";
import { CreateRandomIdChart } from "../../../Utils";

/* Prop definition */
type Props = {
  data: any[];
};

const StackedSkeleton: React.FunctionComponent<Props> = ({ data }) => {
  const [idChart] = React.useState(CreateRandomIdChart("StackedSkeleton"));
  const chart = React.useRef(null);

  React.useEffect(() => {
    // Apply chart themes
    // am4core.useTheme(am4themes_animated);
    // am4core.useTheme(am4themes_material);

    // // Create chart instance
    // chart.current = am4core.create(idChart, am4charts.XYChart);

    // // Create axes
    // var categoryAxis = chart.current.xAxes.push(new am4charts.CategoryAxis());
    // categoryAxis.dataFields.category = "month";
    // /* categoryAxis.title.text = "Local country offices"; */
    // categoryAxis.renderer.grid.template.location = 0;
    // categoryAxis.renderer.minGridDistance = 20;
    // categoryAxis.renderer.grid.template.strokeOpacity = 0;

    // var valueAxis = chart.current.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.min = 0;
    // valueAxis.renderer.grid.template.strokeOpacity = 0.08;
    // valueAxis.renderer.grid.template.strokeDasharray = "8,8";
    // valueAxis.max = 100;
    // //valueAxis.calculateTotals = true;
    // //valueAxis.strictMinMax = true;

    // // legend
    // chart.current.legend = new am4charts.Legend();
    // chart.current.legend.useDefaultMarker = true;
    // chart.current.legend.position = "bottom";
    // const marker: any =
    //   chart.current.legend.markers.template.children.getIndex(0);
    // marker.cornerRadius(12, 12, 12, 12);
    // marker.strokeWidth = 1;
    // marker.strokeOpacity = 0.1;
    // marker.height = 15;
    // marker.width = 15;
    // marker.vAlign = "middle";
    // marker.stroke = am4core.color("#ccc");

    // // Create series
    // var series = chart.current.series.push(new am4charts.ColumnSeries());
    // series.dataFields.valueY = "clicks";
    // //series.dataFields.valueYShow = "totalPercent";
    // series.dataFields.categoryX = "month";
    // series.name = "Clicks";
    // series.stacked = true;
    // series.fill = am4core.color(BAR_COLORS[1]);
    // series.stroke = am4core.color("#fff");
    // series.columns.template.column.cornerRadiusBottomLeft = 5;
    // series.columns.template.column.cornerRadiusBottomRight = 5;

    // var series2 = chart.current.series.push(new am4charts.ColumnSeries());
    // series2.dataFields.valueY = "impressions";
    // //series2.dataFields.valueYShow = "totalPercent";
    // series2.dataFields.categoryX = "month";
    // series2.name = "Impressions";
    // series2.stacked = true;
    // series2.fill = am4core.color("#EEF0FF");
    // series2.stroke = am4core.color("#fff");

    // var series3 = chart.current.series.push(new am4charts.ColumnSeries());
    // series3.dataFields.valueY = "target";
    // //series3.dataFields.valueYShow = "totalPercent";
    // series3.dataFields.categoryX = "month";
    // series3.name = "Target";
    // series3.stacked = true;
    // series3.fill = am4core.color(BAR_COLORS[0]);
    // series3.stroke = am4core.color("#fff");
    // series3.columns.template.column.cornerRadiusTopLeft = 5;
    // series3.columns.template.column.cornerRadiusTopRight = 5;

    // // Add cursor
    // chart.current.cursor = new am4charts.XYCursor();
  }, []);

  React.useEffect(() => {
    chart.current.data = data;
  }, [data]);

  return <div id={idChart} className="StackedSkeleton"></div>;
};

export default React.memo(StackedSkeleton);
