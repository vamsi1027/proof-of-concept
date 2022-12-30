import React from "react";
import { CreateRandomIdChart } from "../Utils";
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { BAR_COLORS } from "../Utils/constants";

/* Prop definition */
type Props = {
  data: any[];
};

const Heatmap: React.FunctionComponent<Props> = ({ data }) => {
  const [idChart] = React.useState(CreateRandomIdChart("Heatmap"));
  const chart = React.useRef(null);

  React.useEffect(() => {
    // am4core.useTheme(am4themes_animated);

    // chart.current = am4core.create(idChart, am4charts.XYChart);
    // chart.current.maskBullets = false;

    // var xAxis = chart.current.xAxes.push(new am4charts.CategoryAxis());
    // var yAxis = chart.current.yAxes.push(new am4charts.CategoryAxis());

    // xAxis.dataFields.category = "day";
    // yAxis.dataFields.category = "hour";

    // xAxis.renderer.grid.template.disabled = true;
    // xAxis.renderer.minGridDistance = 40;

    // yAxis.renderer.grid.template.disabled = true;
    // yAxis.renderer.inversed = true;
    // yAxis.renderer.minGridDistance = 20;
    // yAxis.renderer.opposite = true;

    // var series = chart.current.series.push(new am4charts.ColumnSeries());
    // series.dataFields.categoryX = "day";
    // series.dataFields.categoryY = "hour";
    // series.dataFields.value = "value";
    // series.sequencedInterpolation = true;
    // series.defaultState.transitionDuration = 3000;
    // series.columns.template.width = am4core.percent(100);
    // series.columns.template.height = am4core.percent(100);

    // series.heatRules.push({
    //   target: series.columns.template,
    //   property: "fill",
    //   min: am4core.color(BAR_COLORS[1]),
    //   max: am4core.color(BAR_COLORS[0]),
    // });

    // var columnTemplate = series.columns.template;
    // columnTemplate.strokeWidth = 8;
    // columnTemplate.strokeOpacity = 1;
    // columnTemplate.stroke = am4core.color("#ffffff");
    // columnTemplate.tooltipText =
    //   "{day}, {hour}: {value.workingValue.formatNumber('#.')}";

    // // heat legend
    // var heatLegend = chart.current.bottomAxesContainer.createChild(
    //   am4charts.HeatLegend
    // );
    // heatLegend.width = am4core.percent(100);
    // heatLegend.series = series;
    // heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
    // heatLegend.valueAxis.renderer.minGridDistance = 30;

    // // heat legend behavior
    // series.columns.template.events.on("over", (event) => {
    //   handleHover(event.target);
    // });

    // series.columns.template.events.on("hit", (event) => {
    //   handleHover(event.target);
    // });

    // function handleHover(column) {
    //   if (!isNaN(column.dataItem.value)) {
    //     heatLegend.valueAxis.showTooltipAt(column.dataItem.value);
    //   } else {
    //     heatLegend.valueAxis.hideTooltip();
    //   }
    // }

    // series.columns.template.events.on("out", (event) => {
    //   heatLegend.valueAxis.hideTooltip();
    // });
  }, []);

  React.useEffect(() => {
    chart.current.data = data;
  }, [data]);

  return <div id={idChart} style={{ height: "calc(100% - 8rem)" }}></div>;
};

export default React.memo(Heatmap);
