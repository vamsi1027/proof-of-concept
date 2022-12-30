import React, { useState } from 'react';
import * as S from "./Waterfall.styles";

// charts library
// import * as am4core from '@amcharts/amcharts4/core';
// import * as am4charts from '@amcharts/amcharts4/charts';
// import am4themes_material from '@amcharts/amcharts4/themes/material';
// import am4themes_animated from '@amcharts/amcharts4/themes/animated';
// import { Color } from '@amcharts/amcharts4/core';

//utils
// import { CreateRandomIdChart } from '../Utils';
import LoadingSpinner from "../../LoadingSpinner";
import WaterfallSkeleton from "./WaterfallSkeleton";
import NoDataChart from "../NoDataChart";
import { Bar } from 'react-chartjs-2';
import { useTheme } from '@material-ui/core';
import { Colors } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';
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

export type DataForWaterfallChartType = {
	category: string,
	// parent: string,
	tooltipValue: number,
	open: number,
	stepValue: number,
	// color?: Color,
	value: number;
}

type Props = {
	data: [DataForWaterfallChartType],
	inlineData?: string[],
	isLoading?: boolean
}

const WaterFallChart: React.FC<Props> = ({ data = [], inlineData, isLoading = false }) => {
	// const chart: any = useRef(null);
	// const [idChart] = useState(CreateRandomIdChart('waterfall'));
	const [useSkeleton, setUseSkeleton] = useState(isLoading);
	const { t } = useTranslation();
	const theme = useTheme();

	const chartData = {
		labels: buildLabels(),
		datasets: buildDataset()
	};

	function buildDataset() {
		const chartValue = [];
		data.forEach((item: any, index) => {
			if (index === 0) {
				chartValue.push([0, item.tooltipValue]);
			} else {
				chartValue.push([data[index - 1].tooltipValue, item.tooltipValue]);
			}
		});

		return [{
			backgroundColor: ["#474E5F", "#818FFE", "#B7B7F3", "#FFC5AE", "#FFD6C7"],
			data: chartValue,
			barThickness: 40,
			maxBarThickness: 40,
			barPercentage: 1,
			categoryPercentage: 1
		}]
	}

	function buildLabels() {
		const labels = [];
		data.forEach((item: any, index) => {
			labels.push(item.category)
		});
		return labels;
	}

	const options: any = {
		maintainAspectRatio: false,
		cornerRadius: 55,
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
		responsive: true,
		plugins: {
			legend: {
				position: false
			},
			tooltip: {
				displayColors: false,
				callbacks: {
					label: function (context) {
						return context.raw[1];
					}
				},
			}
		}
	};

	// useLayoutEffect(() => {

	// 	am4core.useTheme(am4themes_animated);
	// 	am4core.useTheme(am4themes_material);
	// 	let x = am4core.create(idChart, am4charts.XYChart);

	// 	x.data = data || [];

	// 	const categoryAxis = x.xAxes.push(new am4charts.CategoryAxis());
	// 	categoryAxis.dataFields.category = 'category';
	// 	categoryAxis.renderer.minGridDistance = 10;
	// 	categoryAxis.renderer.grid.template.disabled = true;
	// 	categoryAxis.margin(20, 0, 0, 0);
	// 	categoryAxis.fontWeight = '100';
	// 	categoryAxis.cursorTooltipEnabled = false;
	// 	const label_xAxis = categoryAxis.renderer.labels.template;
	// 	label_xAxis.wrap = true;
	// 	categoryAxis.events.on("sizechanged", function (ev) {
	// 		let axis = ev.target;
	// 		let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
	// 		axis.renderer.labels.template.maxWidth = cellWidth;
	// 	});

	// 	const tooltipValueAxis = x.yAxes.push(new am4charts.ValueAxis());
	// 	tooltipValueAxis.renderer.grid.template.disabled = true;
	// 	tooltipValueAxis.strictMinMax = true;
	// 	tooltipValueAxis.cursorTooltipEnabled = false;


	// 	const columnSeries = x.series.push(new am4charts.ColumnSeries());
	// 	columnSeries.dataFields.categoryX = 'category';
	// 	columnSeries.dataFields.valueY = 'value';
	// 	columnSeries.dataFields.openValueY = 'open';
	// 	columnSeries.tooltipText = '{category}: [b]{tooltipValue}[/]';

	// 	const columnTemplate = columnSeries.columns.template;
	// 	columnTemplate.strokeOpacity = 0;
	// 	columnTemplate.propertyFields.fill = 'color';
	// 	columnTemplate.width = am4core.percent(45);

	// 	x.cursor = new am4charts.XYCursor();
	// 	x.cursor.lineY.disabled = true;
	// 	x.cursor.lineX.disabled = true;
	// 	x.cursor.behavior = 'none';
	// 	/*
	// 			let label = x.createChild(am4core.Label);
	// 			label.html = `<div style='display: flex; flex-direction: row; align-items: center; justify-content: center'><div style='height: 15px; width: 15px; background-color: ${WATERFALL_COLORS[1]}; border-radius: 50%; margin-right: 5px'></div> <span>Push</span></div>`;
	// 			label.fontSize = 12;
	// 			label.align = 'right';
	// 			label.isMeasured = false;
	// 			label.x = am4core.percent(85);
	// 			label.y = am4core.percent(5);

	// 			let label2 = x.createChild(am4core.Label);
	// 			label2.html = `<div style='display: flex; flex-direction: row; align-items: center; justify-content: center'><div style='height: 15px; width: 15px; background-color: ${WATERFALL_COLORS[6]}; border-radius: 50%; margin-right: 5px'></div> <span>In-App</span></div>`;
	// 			label2.fontSize = 12;
	// 			label2.align = 'right';
	// 			label2.isMeasured = false;
	// 			label2.x = am4core.percent(92);
	// 			label2.y = am4core.percent(5);
	// 	*/
	// 	/*let label3 = x.createChild(am4core.Label);
	// 	label3.html = `<bold>Push</bold>`;
	// 	label3.fontSize = 17;
	// 	label3.align = 'right';
	// 	label3.isMeasured = false;
	// 	label3.x = am4core.percent(22);
	// 	label3.y = am4core.percent(88);

	// 	let label4 = x.createChild(am4core.Label);
	// 	label4.html = `<bold>In-App</bold>`;
	// 	label4.fontSize = 17;
	// 	label4.align = 'right';
	// 	label4.isMeasured = false;
	// 	label4.x = am4core.percent(60.8);
	// 	label4.y = am4core.percent(88);*/

	// 	x.background.visible = false;
	// 	x.responsive.enabled = true;
	// 	chart.current = x;
	// 	setUseSkeleton(false);

	// 	return () => {
	// 		x.dispose();
	// 	};

	// }, [data, inlineData, idChart]);

	return (
		(useSkeleton)
			?
			<S.Container className="chart-loader">
				<Spinner color={"blue"} />
				{/* <div id={idChart} style={{ height: '0px', width: '0px' }} /> */}
			</S.Container>
			:
			<S.Container>
				{
					(data.length === 0 && !isLoading)
					&& <NoDataChart />
				}
				{/* <div id={idChart} className={classes.containerChart} /> */}
				<div className="container-chart"><Bar data={chartData} options={options} /></div>
			</S.Container>
	)
};

export default WaterFallChart;
