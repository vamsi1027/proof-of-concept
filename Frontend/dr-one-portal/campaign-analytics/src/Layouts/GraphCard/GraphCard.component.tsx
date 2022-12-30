import React, { ElementType, useContext } from "react";
import { Card, CardContent, Typography, Button } from "@material-ui/core";
import { classNames } from "../../utils";
import { icon_download } from "../../assets";
import { Variant } from "@material-ui/core/styles/createTypography";
import { useTranslation } from 'react-i18next';
import * as S from "./GraphCard.style";
import { Grid } from '@material-ui/core';
import { helper } from '@dr-one/utils';
import { GlobalContext } from '../../context/globalState';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

/* Prop definition */
type Props = {
  className?: string;
  avatar?: string;
  title: string;
  actions?: any;
  onExport?: VoidFunction;
  contentRelative?: boolean;
  isLoading?: boolean;
  data?: any;
  campaignInfo?: any;
  isExportable?: boolean;
};

/**
 * Custom layout to wrap a graph
 * @param avatar - icon before the title
 * @param title - current graph title
 * @param actions - header middle content
 * @param onExport - function to get the graph content as image
 * @param children - nested jsx as graph generator
 * @returns Graph Card Layout
 */
const GraphCardLayout: React.FunctionComponent<Props & Record<string, any>> = ({
  className,
  avatar,
  title,
  actions,
  onExport,
  children,
  isExportable = true,
  raised = false,
  contentRelative = true,
  isLoading,
  data,
  campaignInfo,
  ...rest
}) => {
  const { t } = useTranslation();
  const { state } = useContext(GlobalContext);
  const { dispatch } = useContext(GlobalContext);

  const fromDate = window.location.pathname.indexOf('aggregate') >= 0 ? helper.formatDateWithSlash(state.dateRange?.startDate).split('/').join('-') : '';
  const toDate = window.location.pathname.indexOf('aggregate') >= 0 ? helper.formatDateWithSlash(state.dateRange?.endDate).split('/').join('-') : '';

  const props = {
    /* Card parent */
    parent: { className: classNames("graphCard", className), elevation: raised ? 2 : 0 },

    /* header */
    header: { className: "title" },

    /* header avatar */
    avatar: { src: avatar, alt: `${title} Graph` },

    /* header title */
    title: {
      component: "h3" as ElementType,
      variant: "subtitle1" as Variant,
    },

    /* header actions */
    actions: { className: "actions" },

    /* header export */
    export: {
      endIcon: <img src={icon_download} alt={`${title} Graph Download`} />,
      className: "export",
      onClick: onExport,
    },

    cardContent: {
      style: {
        height: "100%",
        position: (contentRelative) ? 'relative' : 'inherit'
      }
    }
  };

  const exportChartData = (): void => {
    if (title.includes(t('CAMPAIGN_ANALYTICS_FUNNEL_PER_MONTH'))) {
      const csvData = [];
      const labels = ['Month', 'Clicks', 'Impressions'];
      const monthObject = state.funnelPerMonth[state.funnelPerMonth.campaignSelectionType];

      const labelArrayModified = labels.map(string => string === null ? '' : `\"${string}\"`);
      Object.keys(monthObject).forEach((item, index) => {
        csvData.push([item]);
      });

      Object.keys(monthObject).forEach((item, index) => {
        csvData[index].push(monthObject[item].clicks);
        csvData[index].push(monthObject[item].impressions);
      });

      csvData.unshift(['Start Date', helper.formatDateWithSlash(state.dateRange.startDate).split('/').join('-')], ['End Date', helper.formatDateWithSlash(state.dateRange.endDate).split('/').join('-')], ['Campaign Type', state.funnelPerMonth.campaignSelectionType === 'INAPP' ? 'In - App' : state.funnelPerMonth.campaignSelectionType === 'PUSH_INAPP' ? 'Push + In - App' : helper.stringCapitalize(state.funnelPerMonth.campaignSelectionType)], [], labelArrayModified);
      const csvDataArray = csvData.join('\n');
      const csvFile = new Blob([csvDataArray], { type: "text/csv" });
      const csvLink = document.createElement('a');

      csvLink.download = 'funnel_per_month_' + new Date().toISOString().slice(0, 10) + '.csv';;
      const url = window.URL.createObjectURL(csvFile);
      csvLink.href = url;

      csvLink.style.display = "none";
      document.body.appendChild(csvLink);

      csvLink.click();
      document.body.removeChild(csvLink);
    } else {
      const graphData = JSON.parse(JSON.stringify(data));

      const objectForExportArray = {};
      let exportArray;
      if (graphData && graphData[0].hasOwnProperty('category')) {
        objectForExportArray['Start Date'] = fromDate;
        objectForExportArray['End Date'] = toDate;
        objectForExportArray['Funnel Type'] = title;
        graphData.map(val => {
          objectForExportArray[val.category] = val.tooltipValue;
          return objectForExportArray;
        })
        exportArray = [objectForExportArray];
      } else {
        objectForExportArray['Start Date'] = fromDate;
        objectForExportArray['End Date'] = toDate;
        objectForExportArray['Funnel Type'] = title;
        graphData.map(val => {
          objectForExportArray[val.name] = val.value;
          return objectForExportArray;
        })
        exportArray = [objectForExportArray];
      }

      const modifiedArray = [Object.keys(exportArray[0])].concat(exportArray);
      const csvElement = document.createElement('a');
      csvElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(modifiedArray.map(it => {
        return Object.values(it).map(value => {
          return typeof value === 'string' ? JSON.stringify(value) : value
        }).toString()
      }).join('\n'));

      csvElement.target = '_blank';
      csvElement.download = window.location.pathname.indexOf('aggregate') >= 0 ? `aggregate_analytics_${helper.formatDate(new Date())}.csv` :
        `${campaignInfo.name}_${title}_${helper.formatDate(new Date())}.csv`;
      csvElement.click();
      csvElement.remove()
    }

  }

  const onCampaignTypeChange = (event, newValue): void => {
    const modifiedPayload = Object.assign({}, state.funnelPerMonth);
    modifiedPayload['campaignSelectionType'] = newValue;
    dispatch({
      type: "SET_FUNNEL_PER_MONTH",
      payload: modifiedPayload
    });
  }
  
  return (
    window.location.pathname.indexOf('PUSH_INAPP') > -1 ? <Grid item xs={12} md={6} className="mt-15">
      <S.Container>

        <Card {...props.parent} {...rest}>
          <div {...props.header}>
            {avatar && <img {...props.avatar} />}

            {
              title.includes('Conversion Funnel') || title.includes(t('CAMPAIGN_ANALYTICS_FUNNEL_PER_MONTH'))
                ? <Typography {...props.title}>{title} </Typography>
                : <Typography {...props.title}>{title} | {t('CAMPAIGN_ANALYTICS_PUSH_OVER_IMPRESSIONS_LABEL')} </Typography>
            }
            <div {...props.actions}>
              {typeof actions !== "undefined" && <div>{actions}</div>}
            </div>

            {isExportable && (
              <Button className="export" variant="outlined" {...props.export} disabled={isLoading || data?.length === 0} onClick={exportChartData}>
                {t('EXPORT_BUTTON')}
              </Button>
            )}
          </div>
          <CardContent >{children}</CardContent>
        </Card>
      </S.Container>

    </Grid> :
      <Grid item xs={12} md={12} className="mt-15 height-fit">
        <S.Container>

          <Card {...props.parent} {...rest}>
            <div {...props.header}>
              {avatar && <img {...props.avatar} />}

              {
                title.includes('Conversion Funnel') || title.includes(t('CAMPAIGN_ANALYTICS_FUNNEL_PER_MONTH'))
                  ? <Typography {...props.title}>{title} </Typography>
                  : <Typography {...props.title}>{title} | {t('CAMPAIGN_ANALYTICS_PUSH_OVER_IMPRESSIONS_LABEL')} </Typography>
              }
              <div {...props.actions}>
                {typeof actions !== "undefined" && <div>{actions}</div>}
              </div>

              {title.includes(t('CAMPAIGN_ANALYTICS_FUNNEL_PER_MONTH')) && <ToggleButtonGroup className="graph-tab-month-funnel"
                value={state.funnelPerMonth.campaignSelectionType}
                exclusive
                onChange={onCampaignTypeChange} >
                <ToggleButton disableRipple value="PUSH">
                  {t('CAMPAIGN_TYPE_PUSH')}
                </ToggleButton>
                <ToggleButton disableRipple value="INAPP">
                  {t('CAMPAIGN_ANALYTICS_IN_APP_TAB')}
                </ToggleButton>
                <ToggleButton disableRipple value="PUSH_INAPP">
                  {t('CAMPAIGN_ANALYTICS_PUSH_IN_APP_TAB')}
                </ToggleButton>
              </ToggleButtonGroup>}

              {isExportable && (
                <Button className="export" variant="outlined" {...props.export} disabled={isLoading || (title.includes(t('CAMPAIGN_ANALYTICS_FUNNEL_PER_MONTH')) && (state.funnelPerMonth[state.funnelPerMonth.campaignSelectionType] && Object.keys(state.funnelPerMonth[state.funnelPerMonth.campaignSelectionType]).length === 0) || state.funnelPerMonth[state.funnelPerMonth.campaignSelectionType] === undefined) || (
                  !title.includes(t('CAMPAIGN_ANALYTICS_FUNNEL_PER_MONTH')) && data?.length === 0)} onClick={exportChartData}>
                  {t('EXPORT_BUTTON')}
                </Button>
              )}
            </div>
            <CardContent >{children}</CardContent>
          </Card>
        </S.Container>

      </Grid>

  );
};

export default React.memo(GraphCardLayout);
