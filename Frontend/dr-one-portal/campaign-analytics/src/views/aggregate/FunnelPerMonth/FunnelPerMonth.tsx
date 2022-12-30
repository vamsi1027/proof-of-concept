import React, { useEffect, useContext, useState } from "react";
import * as S from "./FunnelPerMonth.styles";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { GlobalContext } from '../../../context/globalState';
import { useTranslation } from 'react-i18next';
import GroupBarChart from './GroupBarChart'
import { GraphCardLayout, RowLayout } from "../../../Layouts";
import { classNames } from "../../../utils";

function FunnelPerMonth() {
    const { dispatch } = useContext(GlobalContext);
    const { state } = useContext(GlobalContext);
    const { t } = useTranslation();
    const [loader, setLoader] = useState(false);

    const props = {
        parent: {
            className: classNames("in-app-cf", ''),
            style: {
                minHeight: "25rem",
            },
            title: t('CAMPAIGN_ANALYTICS_FUNNEL_PER_MONTH'),
            raised: true,
            data: []
        },
        chart: {
            isLoading: loader,
            data: [],
            isExportable: true
        }
    };

    const rowProps = {
        parent: {
            className: classNames("conversion-funnel", 'conversionFunnel'),
            columns: 1,
        },
    };

    useEffect(() => {
        setLoader(true);
        apiDashboard.get(`campaign-mgmt-api/analytics/campaign/aggregated/month?startDate=${helper.formatDateWithSlash(state.dateRange.startDate).split('/').join('-')}&endDate=${helper.formatDateWithSlash(state.dateRange.endDate).split('/').join('-')}`).then(response => {
            const modifiedPayload = Object.assign({}, state.funnelPerMonth);
            modifiedPayload['PUSH'] = response.data.metrics.PUSH;
            modifiedPayload['INAPP'] = response.data.metrics.INAPP;
            modifiedPayload['PUSH_INAPP'] = response.data.metrics.PUSH_INAPP;
            modifiedPayload['campaignSelectionType'] = state.funnelPerMonth.campaignSelectionType;

            dispatch({
                type: "SET_FUNNEL_PER_MONTH",
                payload: modifiedPayload
            });
            setLoader(false);
        }, error => {
            dispatch({
                type: "SET_FUNNEL_PER_MONTH",
                payload: {
                    campaignSelectionType: 'PUSH',
                    push: {},
                    inApp: {},
                    pushInApp: {}
                }
            });
            setLoader(false);
        });

    }, [state.dateRange]);

    return (
        <S.Container>
            <RowLayout {...rowProps.parent} >
                <GraphCardLayout {...props.parent} {...props.chart}>
                    <GroupBarChart loader={loader} />
                </GraphCardLayout>
            </RowLayout>
        </S.Container>
    );
}

export default FunnelPerMonth;