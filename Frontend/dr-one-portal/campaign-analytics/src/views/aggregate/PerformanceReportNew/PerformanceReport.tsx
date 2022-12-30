import React, { useState, useEffect } from "react";
import * as S from "./PerformanceReport.styles";
import {
    Select,
    MenuItem,
    FormControl,
    Button,
    Avatar
} from "@material-ui/core";
import { apiDashboard, helper } from "@dr-one/utils";
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import { Spinner, Breadcrumb } from "@dr-one/shared-component";
import { LightTooltip } from "@dr-one/shared-component";

function PerformanceReport() {
    const { t } = useTranslation();
    const [monthList, setMonthList] = useState([]);
    const [selectedMonth, setMonth] = useState('');
    const [userData, setUserData] = useState(Object);
    const [campaignData, setCampaignData] = useState(Object);
    const [loader, setLoader] = useState(false);
    const hierarchyList = [t('OVERALL_PERFORMANCE_REPORT')];

    useEffect(() => {
        setLoader(true);
        apiDashboard
            .get(`campaign-mgmt-api/systemperformance/reports/monthList`)
            .then(response => {
                setMonthList(response.data.data);
                setMonth(response.data.data[0]);
                if (response.data.data.length !== 0) {
                    apiDashboard
                        .get(`campaign-mgmt-api/systemperformance/reports/?month=${response.data.data[0]}`)
                        .then(response => {
                            setUserData(response.data.data.userRelatedReport);
                            setCampaignData(response.data.data.campaignRelatedReport);
                            setLoader(false);
                        }, error => {
                            setUserData(Object);
                            setCampaignData(Object);
                            setLoader(false);
                        });
                } else {
                    setLoader(false);
                }
            }, error => {
                setMonthList([]);
                setLoader(false);
            });
    }, [])

    const setUsetDataOnMonthChange = (month: any): void => {
        setMonth(month);
        setLoader(true);
        apiDashboard
            .get(`campaign-mgmt-api/systemperformance/reports/?month=${month}`)
            .then(response => {
                setUserData(response.data.data.userRelatedReport);
                setCampaignData(response.data.data.campaignRelatedReport);
                setLoader(false);
            }, error => {
                setUserData(Object);
                setCampaignData(Object);
                setLoader(false);
            });
    }

    const exportCSV = (): void => {
        const exportArray: any = [{
            'Month / Year': selectedMonth,
            'Total Preload Users': userData.totalPreloadUsers,
            'Monthly Active Preload Users': userData.monthlyActivePreloadUsers,
            'Last 6 Months Active Preload Users': userData.sixMonthsActivePreloadUsers,
            'Total SDK Users': userData.totalSdkUsers,
            'Monthly Active SDK Users': userData.monthlyActiveSdkUsers,
            'Last 6 Months Active SDK Users': userData.sixMonthsActiveSdkUsers,
            'Avg. Price per Click': `$ ${campaignData?.averagePricePerClick ? campaignData.averagePricePerClick.toFixed(2) : 0}`
        }];
        exportArray.map(label => {
            switch (label) {
                case 'Total Preload Users':
                    label = t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_TOTAL_PRELOAD_USERS_LABEL');
                    break;
                case 'Monthly Active Preload Users':
                    label = t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_MONTHLY_ACTIVE_PRELOAD_USERS_LABEL');
                    break;
                case 'Last 6 Months Active Preload Users':
                    label = t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_LAST_6_MONTHS_ACTIVE_PRELOAD_USERS_LABEL');
                    break;
                case 'Total SDK Users':
                    label = t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_TOTAL_SDK_USERS_LABEL')
                    break;
                case 'Monthly Active SDK Users':
                    label = t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_MONTHLY_ACTIVE_SDK_USERS_LABEL');
                    break;
                case 'Last 6 Months Active SDK Users':
                    label = t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_LAST_6_MONTHS_ACTIVE_SDK_USERS_LABEL');
                    break;
                case 'Avg. Price per Click':
                    label = t('AGGREGATE_CAMPAIGN_ANALYTICS_CAMPAIGN_RELATED_AVERAGE_PRICE_PER_CLICK');
                    break;
                case 'Month / Year':
                    label = t('CAMPAIGN_ANALYTICS_USER_PERFORMNACE_REPORT_EXPORT_FILE_MONTH_YEAR');
                    break;
            }
            return label;
        })
        const modifiedArray = [Object.keys(exportArray[0])].concat(exportArray);
        const csvElement = document.createElement('a');
        csvElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(modifiedArray.map(it => {
            return Object.values(it).map(value => {
                return typeof value === 'string' ? JSON.stringify(value) : value
            }).toString()
        }).join('\n'));

        csvElement.target = '_blank';
        csvElement.download = `${t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_REPORT_HEADER')}_${helper.formatDate(new Date())}.csv`;
        csvElement.click();
        csvElement.remove();
    }

    return (
        <S.Container>
            <Breadcrumb hierarchy={hierarchyList} />
            <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                    <div className="performance-report-wrap">

                        <div className="tittle">
                            <h3>{t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_REPORT_HEADER')}</h3>
                            <div>
                                <Select
                                    className="rp-select"
                                    MenuProps={{
                                        anchorOrigin: {
                                            vertical: "bottom",
                                            horizontal: "left"
                                        },
                                        transformOrigin: {
                                            vertical: "top",
                                            horizontal: "left"
                                        },
                                        getContentAnchorEl: null
                                    }}
                                    // label="month"
                                    value={selectedMonth}
                                    onChange={(e) => {
                                        setUsetDataOnMonthChange(e.target.value)
                                    }}
                                    name="month"
                                >
                                    {
                                        monthList.map((month, index) => (
                                            <MenuItem key={index} value={month}>{month}</MenuItem>
                                        ))}
                                </Select>
                                <Button
                                    className="export"
                                    variant="outlined"
                                    endIcon={<Avatar src="/icons/download.svg" />}
                                    disabled={Object.keys(userData).length === 0}
                                    onClick={() => exportCSV()}
                                >
                                    {t('EXPORT_BUTTON')}
                                </Button>
                            </div>
                        </div>
                        {loader && <div className="chart-loader height-250"><Spinner color={"blue"} /></div>}

                        {!loader && <FormControl className="form-select-box">
                            <ul className="list">

                                <li><span>{t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_TOTAL_PRELOAD_USERS_LABEL')} <LightTooltip title={<label>{t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_TOTAL_PRELOAD_USERS_TOOLTIP')}</label>}
                                /></span>: {userData?.totalPreloadUsers}</li>
                                <li><span>{t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_MONTHLY_ACTIVE_PRELOAD_USERS_LABEL')}<LightTooltip title={<label>{t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_MONTHLY_ACTIVE_PRELOAD_USERS_TOOLTIP')}</label>}
                                /> </span>: {userData?.monthlyActivePreloadUsers}</li>
                                <li><span>{t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_LAST_6_MONTHS_ACTIVE_PRELOAD_USERS_LABEL')} <LightTooltip title={<label>{t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_LAST_6_MONTHS_ACTIVE_PRELOAD_USERS_TOOLTIP')}</label>}
                                /></span>: {userData?.sixMonthsActivePreloadUsers}</li>
                                <li><span>{t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_TOTAL_SDK_USERS_LABEL')}<LightTooltip title={<label>{t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_TOTAL_SDK_USERS_TOOLTIP')}</label>}
                                /></span>: {userData?.totalSdkUsers}</li>
                                <li><span>{t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_MONTHLY_ACTIVE_SDK_USERS_LABEL')}<LightTooltip title={<label>{t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_MONTHLY_ACTIVE_SDK_USERS_TOOLTIP')}</label>}
                                /></span>: {userData?.monthlyActiveSdkUsers}</li>
                                <li><span>{t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_LAST_6_MONTHS_ACTIVE_SDK_USERS_LABEL')}<LightTooltip title={<label>{t('AGGREGATE_CAMPAIGN_ANALYTICS_USER_PEROFRMANCE_LAST_6_MONTHS_ACTIVE_SDK_USERS_TOOLTIP')}</label>}
                                /></span>: {userData?.sixMonthsActiveSdkUsers}</li>
                                <li><span>{t('AGGREGATE_CAMPAIGN_ANALYTICS_CAMPAIGN_RELATED_AVERAGE_PRICE_PER_CLICK')}</span>: $ {campaignData?.averagePricePerClick ? campaignData?.averagePricePerClick.toFixed(2) : 0}</li>
                            </ul>
                        </FormControl>}

                    </div>
                </Grid>
            </Grid >
        </S.Container>
    );
}

export default PerformanceReport;