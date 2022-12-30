import React, { useEffect, useContext } from "react";
import * as S from "./GroupBarChart.styles";
import { GlobalContext } from '../../../context/globalState';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import { Spinner } from "@dr-one/shared-component";
import { useTheme } from '@material-ui/core';

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

function GroupedBarChart(props) {
    const { dispatch } = useContext(GlobalContext);
    const { state } = useContext(GlobalContext);
    const { t } = useTranslation();
    const theme = useTheme();
    const chartData = {
        labels: buildLabels(),
        datasets: buildDataset()
    };

    function buildDataset() {
        const monthObject = state.funnelPerMonth[state.funnelPerMonth.campaignSelectionType];
        let chartDataArray = [];
        if (monthObject) {
            chartDataArray = [{
                backgroundColor: "#5569FF",
                data: Object.values(monthObject).map(item => item['impressions']),
                barThickness: 30,
                maxBarThickness: 20,
                label: 'Impressions',
                borderRadius: 2
            }, {
                backgroundColor: "#FFB192",
                data: Object.values(monthObject).map(item => item['clicks']),
                barThickness: 30,
                maxBarThickness: 20,
                label: 'Clicks',
                borderRadius: 2
            }];
        }

        return chartDataArray;
    }

    function buildLabels() {
        const labels = [];

        const monthObject = state.funnelPerMonth[state.funnelPerMonth.campaignSelectionType];
        if (monthObject) {
            Object.keys(monthObject).forEach((item, index) => {
                labels.push(item);
            });
        }
       
        return labels;
    }


    const options: any = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true
                }
            },
            tooltip: {
                displayColors: false,
                intersect: true,
                interaction: {
                    mode: 'index'
                }
            }
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
        }
    };

    const showChart = (): boolean => {
        if ((state.funnelPerMonth[state.funnelPerMonth.campaignSelectionType] && Object.keys(state.funnelPerMonth[state.funnelPerMonth.campaignSelectionType]).length === 0) || state.funnelPerMonth[state.funnelPerMonth.campaignSelectionType] === undefined) {
            return false;
        } else {
            return true;
        }
    }

    return (
        (props.loader) ? <S.Container className='chart-loader'>
            <Spinner color={"blue"} />
        </S.Container>
            :
            <S.Container>
                {
                    ((state.funnelPerMonth[state.funnelPerMonth.campaignSelectionType] && Object.keys(state.funnelPerMonth[state.funnelPerMonth.campaignSelectionType]).length === 0) || state.funnelPerMonth[state.funnelPerMonth.campaignSelectionType] === undefined
                    )
                    && <p className='analytics-error'>{t('CAMPAIGN_ANALYTICS_ERROR')}</p>
                }
                {showChart() && <Bar className="group-bar" data={chartData} options={options} />}
            </S.Container>
    );
}

export default GroupedBarChart;