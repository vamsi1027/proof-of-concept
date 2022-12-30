import React, { useState, useContext } from "react";
import {
  Button,
  Box,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Divider,
  Avatar,
  FormControlLabel,
  Checkbox,
  TextField,
  Chip
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup, Autocomplete } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import AnalyticsChart from './AnalyticsChart';
import AnalyticsTable from './AnalyticsTable';
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { GlobalContext } from '../../context/globalState';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
const icon_download = '/icons/download.svg';

const AnalyticsCard = (props) => {
  const { t } = useTranslation();
  const [type, setType] = useState(props.type);
  const { dispatch, state } = useContext(GlobalContext);
  const [chartData, setChartData] = useState(state.analytics[type].chart.data.dataY || []);
  const [chartLabels, setChartLabels] = useState(state.analytics[type].chart.data.dataX || []);
  const [listData, setListData] = useState(state.analytics[type].list.data.values || []);
  const [listLabels, setListLabels] = useState(state.analytics[type].list.data.columns || []);
  const [periodType, setPeriodType] = useState(state.analytics[type].chart.filter.period);
  const [selectedList, setSelectedList] = useState(props.type === 'channel' ? state.analytics.selectedChannelIdList :
    props.type === 'device' ? state.analytics.selectedDeviceIdList : state.analytics.selectedAppIdList);
  const [defaultChipValue, setDefaultChipValue] = useState(props.type === 'channel' ? state.analytics.selectedChannelList :
    props.type === 'device' ? state.analytics.selectedDeviceList : state.analytics.selectedAppList);
  const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [downloadProgress, setDownloadProgress] = useState(false);

  const buttonProps = {
    export: { className: "export" },
    icon: { src: icon_download, alt: "Export PreloadAnalytics" },
  };

  const exportCSV = (): void => {
    const params = {
      groupby: type === 'all' ? 'NONE' : type.toUpperCase(),
      // periodtype: state.analytics[type].chart.filter.period,
      // cumulativeFlag: state.analytics[type].chart.filter.cummulative,
      startdate: encodeURI(helper.formatDateWithSlash(state.analytics.dateRange.from)),
      enddate: encodeURI(helper.formatDateWithSlash(state.analytics.dateRange.to))
    };
    const idListArray = type === 'all' ? [] : type === 'channel' ? state.analytics.selectedChannelList
      : type === 'device' ? state.analytics.selectedDeviceList : state.analytics.selectedAppList
    if (type !== 'all') {
      params['ids'] = idListArray.map(item => item.id).join();
    }
    setDownloadProgress(true);
    apiDashboard.get(`preload/analytics/organizationid/${organizationId}/export`, {
      params: params,
      // responseType: 'blob',
      onDownloadProgress: progressEvent => {
        let percentCompleted = Math.round(100 * progressEvent.loaded / progressEvent.total);
        console.log(`File is ${percentCompleted}% downloaded`);
      }
    }).then(res => {
      Mixpanel.track('Table Data Export Action Completed', {
        tab: helper.stringCapitalize(type),
        startDate: helper.formatDateWithSlash(state.analytics.dateRange.from),
        endDate: helper.formatDateWithSlash(state.analytics.dateRange.to),
        page: 'Preload Analytics Page View'
      });
      
      setDownloadProgress(false);
      const downloadFileName = 'preload-analytics-export_' + new Date().toISOString().slice(0, 10) + '.csv';
      if (window.navigator['msSaveOrOpenBlob']) {
        window.navigator['msSaveOrOpenBlob'](res.data, downloadFileName);
      } else {
        const anchorElm = document.createElement('a');
        anchorElm.setAttribute('type', 'hidden');
        anchorElm.download = downloadFileName;
        anchorElm.href = 'data:text/csv;charset=utf-8,' + encodeURI(res.data)
        document.body.appendChild(anchorElm);
        anchorElm.click();
        anchorElm.remove(); // remove the element
      }
    }, error => {
      setDownloadProgress(false);
    });
  }

  const getDateDiffByDay = (): number => {
    let diff;

    if (state.analytics.dateRange.from && state.analytics.dateRange.to) {
      diff = Math.ceil((Math.abs(state.analytics.dateRange.to.getTime() - state.analytics.dateRange.from.getTime())) / (1000 * 3600 * 24));
    }

    return diff;
  }

  const enableHourPeriod = (): boolean => {
    let flag = false;
    if (state.analytics.dateRange.from && state.analytics.dateRange.to) {
      if (getDateDiffByDay() < 4) {
        flag = true;
      }
    }

    return flag;
  }

  const enableDayPeriod = (): boolean => {
    let flag = false;
    if (state.analytics.dateRange.from && state.analytics.dateRange.to) {
      if (getDateDiffByDay() < 365) {
        flag = true;
      }
    }

    return flag;
  }

  const enableMonthPeriod = (): boolean => {
    let flag = false;
    if (state.analytics.dateRange.from && state.analytics.dateRange.to) {
      if (getDateDiffByDay() < 365 && getDateDiffByDay() > 32) {
        flag = true;
      }
    }

    return flag;
  }

  const enableYearPeriod = (): boolean => {
    let flag = false;
    if (state.analytics.dateRange.from && state.analytics.dateRange.to) {
      if (getDateDiffByDay() >= 365) {
        flag = true;
      }
    }

    return flag;
  }

  const onPeriodTypeChange = (event, newValue): void => {
    const analytics = Object.assign({}, state.analytics);
    const filter = analytics[state.analytics.currentTab].chart.filter;

    Mixpanel.track('Duration Type Change', {
      tab: helper.stringCapitalize(type),
      periodType: `${helper.stringCapitalize(newValue)}`,
      comulativeFlag: filter.cummulative,
      startDate: helper.formatDateWithSlash(state.analytics.dateRange.from),
      endDate: helper.formatDateWithSlash(state.analytics.dateRange.to),
      page: 'Preload Analytics Page View'
    });

    filter.period = newValue;
    if (newValue !== null) {
      dispatch({
        type: "UPDATE_ANALYTICS_FILTER",
        payload: filter
      });
      props.getAnalyticsChartData(type, type === 'all' ? [] : type === 'channel' ? state.analytics.selectedChannelList
        : type === 'device' ? state.analytics.selectedDeviceList : state.analytics.selectedAppList,
        state.analytics.dateRange.from, state.analytics.dateRange.to, true);
    }
  }

  const onCummulativeFlagChange = (event): void => {
    const analytics = Object.assign({}, state.analytics);
    const filter = analytics[state.analytics.currentTab].chart.filter;
    filter.cummulative = event.target['checked'];

    Mixpanel.track(`Cumulative Flag ${event.target.checked ? 'On' : 'Off'}`, {
      tab: helper.stringCapitalize(type),
      periodType: helper.stringCapitalize(filter.period),
      comulativeFlag: event.target.checked,
      startDate: helper.formatDateWithSlash(state.analytics.dateRange.from),
      endDate: helper.formatDateWithSlash(state.analytics.dateRange.to),
      page: 'Preload Analytics Page View'
    });

    dispatch({
      type: "UPDATE_ANALYTICS_FILTER",
      payload: filter
    });

    props.getAnalyticsChartData(type, type === 'all' ? [] : type === 'channel' ? state.analytics.selectedChannelList
      : type === 'device' ? state.analytics.selectedDeviceList : state.analytics.selectedAppList
      , state.analytics.dateRange.from, state.analytics.dateRange.to);
  }

  const canDisableAutocompleteFields = (): boolean => {
    if (props.type === 'channel') {
      if (state.analytics.selectedChannelList?.length <= 1) {
        return true;
      } else {
        return false;
      }
    } else if (props.type === 'device') {
      if (state.analytics.selectedDeviceList?.length <= 1) {
        return true;
      } else {
        return false;
      }
    } else if (props.type === 'app') {
      if (state.analytics.selectedAppList?.length <= 1) {
        return true;
      } else {
        return false;
      }
    }
  }

  return (
    <Card className="analytics-card">
      <div className="analytics-table-header">
        <p>{t('DEVICE_COUNT')}</p>

        <div className="analytics-right autocomplete-selection">
          {props.type !== 'all' && <Autocomplete
            limitTags={2}
            multiple
            id="checkboxes-tags-demo"
            options={props.type === 'channel' ? state.analytics.channelList :
              props.type === 'device' ? state.analytics.deviceList : state.analytics.appList}
            disableCloseOnSelect
            disableClearable
            value={defaultChipValue}
            getOptionLabel={(option) => props.type !== 'app' ? option.name : option.appName}
            getOptionDisabled={(option) => {
              if (props.type === 'channel' && state?.analytics?.selectedChannelIdList.includes(option.id) && canDisableAutocompleteFields()) {
                return true;
              } else if (props.type === 'device' && state?.analytics?.selectedDeviceIdList.includes(option.id) && canDisableAutocompleteFields()) {
                return true;
              } else if (props.type === 'app' && state?.analytics?.selectedAppIdList.includes(option.id) && canDisableAutocompleteFields()) {
                return true;
              } else {
                return false;
              }
            }}
            onChange={(e, newValue, reason) => {
              if (e.type !== 'keydown') {
                const modifiledChannelList = [];
                newValue.forEach(elem => {
                  modifiledChannelList.push(elem.id);
                })
                setDefaultChipValue(newValue);
                if (props.type === 'channel') {
                  dispatch({
                    type: "SET_CHANNEL_DATA",
                    payload: {
                      channelList: state.analytics.channelList,
                      selectedChannelList: newValue,
                      selectedChannelIdList: modifiledChannelList
                    }
                  });
                  props.getActiveChannelTableList(type, newValue, state.analytics.dateRange.from, state.analytics.dateRange.to);
                } else if (props.type === 'device') {
                  dispatch({
                    type: "SET_DEVICE_DATA",
                    payload: {
                      deviceList: state.analytics.deviceList,
                      selectedDeviceList: newValue,
                      selectedDeviceIdList: modifiledChannelList
                    }
                  });
                  props.getActiveDeviceTableList(type, newValue, state.analytics.dateRange.from, state.analytics.dateRange.to);
                } else if (props.type === 'app') {
                  dispatch({
                    type: "SET_APP_DATA",
                    payload: {
                      appList: state.analytics.appList,
                      selectedAppList: newValue,
                      selectedAppIdList: modifiledChannelList
                    }
                  });
                  props.getActiveAppTableList(type, newValue, state.analytics.dateRange.from, state.analytics.dateRange.to);
                }
                props.getAnalyticsChartData(type, newValue, state.analytics.dateRange.from, state.analytics.dateRange.to);
              }

            }}

            renderOption={(option, { selected }) => (
              <React.Fragment>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  color="primary"
                  checked={selectedList?.includes(option.id)}
                />
                {props.type !== 'app' ? option.name : `${option.appName} ${option.appVersionName}`}
              </React.Fragment>
            )}
            renderTags={(tagValue, getTagProps) =>
              defaultChipValue.map((option, index) => (
                <Chip
                  label={props.type !== 'app' ? option.name : option.appName}
                  {...getTagProps({ index })}
                  disabled={canDisableAutocompleteFields()}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined"
                placeholder={props.type === 'channel' ? t('PRELOAD_MANAGE_POPUP_APP_CHANNELS_ASSOCIATION_PLACEHOLDER') :
                  props.type === 'device' ? t('PRELOAD_ANALYTICS_DEVICE_SEARCH_PLACEHOLDER') : props.type === 'app' ?
                    t('PRELOAD_ANALYTICS_APP_SEARCH_PLACEHOLDER') : ''} />
            )}
          />}
        </div>
        <div className="analytics-right">
          <CardHeader className="export-btn" action={
            <>
              <Button
                variant="contained"
                endIcon={<Avatar {...buttonProps.icon} />}
                {...buttonProps.export}
                disabled={!state.analytics.dateRange.from || !state.analytics.dateRange.to || (
                  (state.analytics.currentTab === 'channel' && state.analytics.selectedChannelList?.length === 0) ||
                  (state.analytics.currentTab === 'device' && state.analytics.selectedDeviceList?.length === 0) ||
                  (state.analytics.currentTab === 'app' && state.analytics.selectedAppList?.length === 0) ||
                  downloadProgress
                )}
                onClick={() => exportCSV()}
              >
                {t('EXPORT_BUTTON')}
              </Button>
            </>
          } />
        </div>
      </div>

      <Divider />
      <CardContent>
        <Box display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pb: 3 }} >
          <ToggleButtonGroup className="graph-tab"
            value={periodType}
            exclusive
            onChange={onPeriodTypeChange}>
            {enableHourPeriod() && <ToggleButton disableRipple value="HOUR">
              {t('PRELAOD_ANALYTICS_HOUR')}
            </ToggleButton>}
            {enableDayPeriod() && <ToggleButton disableRipple value="DAY">
              {t('PRELOAD_ANALYTICS_DAY')}
            </ToggleButton>}
            {enableMonthPeriod() && <ToggleButton disableRipple value="MONTH">
              {t('PRELOAD_ANALYTICS_MONTH')}
            </ToggleButton>}
            {enableYearPeriod() && <ToggleButton disableRipple value="YEAR">
              {t('PRELOAD_ANALYTICS_YEAR')}
            </ToggleButton>}
          </ToggleButtonGroup>
          <FormControlLabel className="graph-label"
            control={<Checkbox
              color='primary'
              name="roles" value="1" />
            }
            label={t('Cumulative')}
            checked={state.analytics[type].chart.filter.cummulative}
            onChange={onCummulativeFlagChange}
          />
        </Box>
        <AnalyticsChart data={chartData} labels={chartLabels} style={{ height: '450px' }} />
        <AnalyticsTable data={listData} columns={listLabels} />
      </CardContent>
    </Card>
  );
}


export default React.memo(AnalyticsCard);