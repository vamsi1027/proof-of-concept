import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Tab,
  Tabs,
  Typography,
  Box,
  Grid,
  InputAdornment,
  TextField
} from "@material-ui/core";
import * as S from "./PreloadAnalytics.styles";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { Breadcrumb } from "@dr-one/shared-component";
import { useTranslation } from 'react-i18next';
import { GlobalContext } from '../../context/globalState';
import AnalyticsCard from './AnalyticsCard';
// import { SelectDate } from "@dr-one/shared-component";
import DateRangeIcon from '@material-ui/icons/DateRange';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import DateRangeTwoToneIcon from '@material-ui/icons/DateRangeTwoTone';
function PreloadAnalytics() {
  const [tabIndex, setTabIndex] = useState(0);
  const tabList = ['all', 'device', 'app'];
  const { t } = useTranslation();
  const hierarchyList = [t('VIRTUAL_PRELOAD'), t('ANALYTICS')];
  const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
  const { dispatch, state } = useContext(GlobalContext);
  const [dateRange, setDateRange] = useState({ startDate: state.analytics.dateRange.from, endDate: state.analytics.dateRange.to, key: 'selection' })
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // getActiveChannelList();
    getActiveDeviceList();
    getActiveAppList();
    getAnalyticsChartData('all', [], state.analytics.dateRange.from, state.analytics.dateRange.to, true);
    getActiveAllTableList('all', [], state.analytics.dateRange.from, state.analytics.dateRange.to);
    Mixpanel.track('Preload Analytics Page View');
    return () => {
      dispatch({
        type: 'RESET_STATE_ANALYTICS'
      })
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    }
  }, [])

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setOpen(false);
    }
  }

  // const getActiveChannelList = (): void => {
  //   apiDashboard.get(`preload/channel/organizationid/${organizationId}?status=ACTIVE`).then(response => {
  //     dispatch({
  //       type: "SET_CHANNEL_DATA",
  //       payload: {
  //         channelList: response?.data?.data,
  //         selectedChannelList: [response?.data?.data[0]],
  //         selectedChannelIdList: [response?.data?.data[0].id]
  //       }
  //     });
  //     getActiveChannelTableList('channel', [response?.data?.data[0]], state.analytics.dateRange.from, state.analytics.dateRange.to);
  //     getAnalyticsChartData('channel', [response?.data?.data[0]], state.analytics.dateRange.from, state.analytics.dateRange.to, true);
  //   }, error => {
  //     dispatch({
  //       type: "SET_CHANNEL_DATA",
  //       payload: {
  //         channelList: [],
  //         selectedChannelList: [],
  //         selectedChannelIdList: []
  //       }
  //     });
  //   });
  // }

  const getActiveDeviceList = (): void => {
    apiDashboard.get(`preload/supporteddevice/organizationid/${organizationId}?status=ACTIVE`).then(response => {
      dispatch({
        type: "SET_DEVICE_DATA",
        payload: {
          deviceList: response?.data?.data,
          selectedDeviceList: [response?.data?.data[0]],
          selectedDeviceIdList: [response?.data?.data[0].id]
        }
      });
      getActiveDeviceTableList('device', [response?.data?.data[0]], state.analytics.dateRange.from, state.analytics.dateRange.to);
      getAnalyticsChartData('device', [response?.data?.data[0]], state.analytics.dateRange.from, state.analytics.dateRange.to, true);
    }, error => {
      dispatch({
        type: "SET_DEVICE_DATA",
        payload: {
          deviceList: [],
          selectedDeviceList: [],
          selectedDeviceIdList: []
        }
      });
    });
  }

  const getActiveAppList = (): void => {
    apiDashboard.get(`preload/supportedapp/organizationid/${organizationId}`).then(response => {
      dispatch({
        type: "SET_APP_DATA",
        payload: {
          appList: response?.data?.data,
          selectedAppList: [response?.data?.data[0]],
          selectedAppIdList: [response?.data?.data[0].id]
        }
      });
      getActiveAppTableList('app', [response?.data?.data[0]], state.analytics.dateRange.from, state.analytics.dateRange.to);
      getAnalyticsChartData('app', [response?.data?.data[0]], state.analytics.dateRange.from, state.analytics.dateRange.to, true);
    }, error => {
      dispatch({
        type: "SET_APP_DATA",
        payload: {
          appList: [],
          selectedAppList: [],
          selectedAppIdList: []
        }
      });
    });
  }

  const getActiveAllTableList = (groupBy: string, idListArray: any, startDate: Date, endDate: Date): void => {
    const urlParams = {
      params: buildURLParamsForTableList(groupBy, idListArray, startDate, endDate)
    };
    const type = groupBy.toLowerCase();
    dispatch({
      type: "TOGGLE_TABLE_LOADER",
      payload: {
        tableAllLoader: state.analytics.currentTab === 'all' ? true : state.analytics.tableAllLoader,
        tableChannelLoader: state.analytics.currentTab === 'channel' ? true : state.analytics.tableChannelLoader,
        tableDeviceLoader: state.analytics.currentTab === 'device' ? true : state.analytics.tableDeviceLoader,
        tableAppLoader: state.analytics.currentTab === 'app' ? true : state.analytics.tableAppLoader
      }
    });
    apiDashboard.get(`preload/analytics/organizationid/${organizationId}/listcount`, urlParams).then(response => {
      const modifiedHeaderData = response?.data?.data?.headers.filter(header => header.name !== 'Channel');
      const modifiedValues = response?.data?.data?.values.map(value => {
        delete value['Channel'];
        return value;
      })
      dispatch({
        type: "UPDATE_ANALYTICS_LIST_DATA",
        payload: {
          data: {
            columns: modifiedHeaderData,
            values: helper.sort(response?.data?.data?.values ? modifiedValues : [], { property: 'Channel', direction: -1 })
          },
          hasMore: response?.data?.data?.hasMore,
          offset: 0,
          limit: 10,
          tab: type,
          sortOrder: state.analytics[type].list.sortOrder,
          sortColumn: state.analytics[type].list.sortColumn
        }
      });
      dispatch({
        type: "TOGGLE_TABLE_LOADER",
        payload: {
          tableAllLoader: state.analytics.currentTab === 'all' ? false : state.analytics.tableAllLoader,
          tableChannelLoader: state.analytics.currentTab === 'channel' ? false : state.analytics.tableChannelLoader,
          tableDeviceLoader: state.analytics.currentTab === 'device' ? false : state.analytics.tableDeviceLoader,
          tableAppLoader: state.analytics.currentTab === 'app' ? false : state.analytics.tableAppLoader
        }
      });
    }, error => {
      dispatch({
        type: "UPDATE_ANALYTICS_LIST_DATA",
        payload: {
          data: {
            columns: [],
            values: []
          },
          hasMore: false,
          offset: 0,
          limit: 10,
          tab: type,
          sortOrder: state.analytics[type].list.sortOrder,
          sortColumn: state.analytics[type].list.sortColumn
        }
      });
      dispatch({
        type: "TOGGLE_TABLE_LOADER",
        payload: {
          tableAllLoader: state.analytics.currentTab === 'all' ? false : state.analytics.tableAllLoader,
          tableChannelLoader: state.analytics.currentTab === 'channel' ? false : state.analytics.tableChannelLoader,
          tableDeviceLoader: state.analytics.currentTab === 'device' ? false : state.analytics.tableDeviceLoader,
          tableAppLoader: state.analytics.currentTab === 'app' ? false : state.analytics.tableAppLoader
        }
      });
    });
  }

  // const getActiveChannelTableList = (groupBy: string, idListArray: any, startDate: Date, endDate: Date): void => {
  //   const urlParams = {
  //     params: buildURLParamsForTableList(groupBy, idListArray, startDate, endDate)
  //   };
  //   const type = groupBy.toLowerCase();
  //   dispatch({
  //     type: "TOGGLE_TABLE_LOADER",
  //     payload: {
  //       tableAllLoader: state.analytics.currentTab === 'all' ? true : state.analytics.tableAllLoader,
  //       tableChannelLoader: state.analytics.currentTab === 'channel' ? true : state.analytics.tableChannelLoader,
  //       tableDeviceLoader: state.analytics.currentTab === 'device' ? true : state.analytics.tableDeviceLoader,
  //       tableAppLoader: state.analytics.currentTab === 'app' ? true : state.analytics.tableAppLoader
  //     }
  //   });
  //   apiDashboard.get(`preload/analytics/organizationid/${organizationId}/listcount`, urlParams).then(response => {
  //     dispatch({
  //       type: "UPDATE_ANALYTICS_LIST_DATA",
  //       payload: {
  //         data: {
  //           columns: response?.data?.data?.headers,
  //           values: helper.sort(response?.data?.data?.values, { property: 'Channel', direction: -1 })
  //         },
  //         hasMore: response?.data?.data?.hasMore,
  //         offset: 0,
  //         limit: 10,
  //         tab: type,
  //         sortOrder: state.analytics[type].list.sortOrder,
  //         sortColumn: state.analytics[type].list.sortColumn
  //       }
  //     });
  //     dispatch({
  //       type: "TOGGLE_TABLE_LOADER",
  //       payload: {
  //         tableAllLoader: state.analytics.currentTab === 'all' ? false : state.analytics.tableAllLoader,
  //         tableChannelLoader: state.analytics.currentTab === 'channel' ? false : state.analytics.tableChannelLoader,
  //         tableDeviceLoader: state.analytics.currentTab === 'device' ? false : state.analytics.tableDeviceLoader,
  //         tableAppLoader: state.analytics.currentTab === 'app' ? false : state.analytics.tableAppLoader
  //       }
  //     });
  //   }, error => {
  //     dispatch({
  //       type: "UPDATE_ANALYTICS_LIST_DATA",
  //       payload: {
  //         data: {
  //           columns: [],
  //           values: []
  //         },
  //         hasMore: false,
  //         offset: 0,
  //         limit: 10,
  //         tab: type,
  //         sortOrder: state.analytics[type].list.sortOrder,
  //         sortColumn: state.analytics[type].list.sortColumn
  //       }
  //     });
  //     dispatch({
  //       type: "TOGGLE_TABLE_LOADER",
  //       payload: {
  //         tableAllLoader: state.analytics.currentTab === 'all' ? false : state.analytics.tableAllLoader,
  //         tableChannelLoader: state.analytics.currentTab === 'channel' ? false : state.analytics.tableChannelLoader,
  //         tableDeviceLoader: state.analytics.currentTab === 'device' ? false : state.analytics.tableDeviceLoader,
  //         tableAppLoader: state.analytics.currentTab === 'app' ? false : state.analytics.tableAppLoader
  //       }
  //     });
  //   });
  // }

  const getActiveDeviceTableList = (groupBy: string, idListArray: any, startDate: Date, endDate: Date): void => {
    const urlParams = {
      params: buildURLParamsForTableList(groupBy, idListArray, startDate, endDate)
    };
    const type = groupBy.toLowerCase();
    dispatch({
      type: "TOGGLE_TABLE_LOADER",
      payload: {
        tableAllLoader: state.analytics.currentTab === 'all' ? true : state.analytics.tableAllLoader,
        tableChannelLoader: state.analytics.currentTab === 'channel' ? true : state.analytics.tableChannelLoader,
        tableDeviceLoader: state.analytics.currentTab === 'device' ? true : state.analytics.tableDeviceLoader,
        tableAppLoader: state.analytics.currentTab === 'app' ? true : state.analytics.tableAppLoader
      }
    });
    apiDashboard.get(`preload/analytics/organizationid/${organizationId}/listcount`, urlParams).then(response => {
      const modifiedHeaderData = response?.data?.data?.headers.filter(header => header.name !== 'Channel');
      const modifiedValues = response?.data?.data?.values.map(value => {
        delete value['Channel'];
        return value;
      })
      dispatch({
        type: "UPDATE_ANALYTICS_LIST_DATA",
        payload: {
          data: {
            columns: modifiedHeaderData,
            values: helper.sort(response?.data?.data?.values ? modifiedValues : [], { property: 'App Name', direction: -1 })
          },
          hasMore: response?.data?.data?.hasMore,
          offset: 0,
          limit: 10,
          tab: type,
          sortOrder: state.analytics[type].list.sortOrder,
          sortColumn: state.analytics[type].list.sortColumn
        }
      });
      dispatch({
        type: "TOGGLE_TABLE_LOADER",
        payload: {
          tableAllLoader: state.analytics.currentTab === 'all' ? false : state.analytics.tableAllLoader,
          tableChannelLoader: state.analytics.currentTab === 'channel' ? false : state.analytics.tableChannelLoader,
          tableDeviceLoader: state.analytics.currentTab === 'device' ? false : state.analytics.tableDeviceLoader,
          tableAppLoader: state.analytics.currentTab === 'app' ? false : state.analytics.tableAppLoader
        }
      });
    }, error => {
      dispatch({
        type: "UPDATE_ANALYTICS_LIST_DATA",
        payload: {
          data: {
            columns: [],
            values: []
          },
          hasMore: false,
          offset: 0,
          limit: 10,
          tab: type,
          sortOrder: state.analytics[type].list.sortOrder,
          sortColumn: state.analytics[type].list.sortColumn
        }
      });
      dispatch({
        type: "TOGGLE_TABLE_LOADER",
        payload: {
          tableAllLoader: state.analytics.currentTab === 'all' ? false : state.analytics.tableAllLoader,
          tableChannelLoader: state.analytics.currentTab === 'channel' ? false : state.analytics.tableChannelLoader,
          tableDeviceLoader: state.analytics.currentTab === 'device' ? false : state.analytics.tableDeviceLoader,
          tableAppLoader: state.analytics.currentTab === 'app' ? false : state.analytics.tableAppLoader
        }
      });
    });
  }

  const getActiveAppTableList = (groupBy: string, idListArray: any, startDate: Date, endDate: Date): void => {
    const urlParams = {
      params: buildURLParamsForTableList(groupBy, idListArray, startDate, endDate)
    };
    const type = groupBy.toLowerCase();
    dispatch({
      type: "TOGGLE_TABLE_LOADER",
      payload: {
        tableAllLoader: state.analytics.currentTab === 'all' ? true : state.analytics.tableAllLoader,
        tableChannelLoader: state.analytics.currentTab === 'channel' ? true : state.analytics.tableChannelLoader,
        tableDeviceLoader: state.analytics.currentTab === 'device' ? true : state.analytics.tableDeviceLoader,
        tableAppLoader: state.analytics.currentTab === 'app' ? true : state.analytics.tableAppLoader
      }
    });
    apiDashboard.get(`preload/analytics/organizationid/${organizationId}/listcount`, urlParams).then(response => {
      const modifiedHeaderData = response?.data?.data?.headers.filter(header => header.name !== 'Channel');
      const modifiedValues = response?.data?.data?.values.map(value => {
        delete value['Channel'];
        return value;
      })
      dispatch({
        type: "UPDATE_ANALYTICS_LIST_DATA",
        payload: {
          data: {
            columns: modifiedHeaderData,
            values: helper.sort(response?.data?.data?.values ? modifiedValues : [], { property: 'Channel', direction: -1 })
          },
          hasMore: response?.data?.data?.hasMore,
          offset: 0,
          limit: 10,
          tab: type,
          sortOrder: state.analytics[type].list.sortOrder,
          sortColumn: state.analytics[type].list.sortColumn
        }
      });
      dispatch({
        type: "TOGGLE_TABLE_LOADER",
        payload: {
          tableAllLoader: state.analytics.currentTab === 'all' ? false : state.analytics.tableAllLoader,
          tableChannelLoader: state.analytics.currentTab === 'channel' ? false : state.analytics.tableChannelLoader,
          tableDeviceLoader: state.analytics.currentTab === 'device' ? false : state.analytics.tableDeviceLoader,
          tableAppLoader: state.analytics.currentTab === 'app' ? false : state.analytics.tableAppLoader
        }
      });
    }, error => {
      dispatch({
        type: "UPDATE_ANALYTICS_LIST_DATA",
        payload: {
          data: {
            columns: [],
            values: []
          },
          hasMore: false,
          offset: 0,
          limit: 10,
          tab: type,
          sortOrder: state.analytics[type].list.sortOrder,
          sortColumn: state.analytics[type].list.sortColumn
        }
      });
      dispatch({
        type: "TOGGLE_TABLE_LOADER",
        payload: {
          tableAllLoader: state.analytics.currentTab === 'all' ? false : state.analytics.tableAllLoader,
          tableChannelLoader: state.analytics.currentTab === 'channel' ? false : state.analytics.tableChannelLoader,
          tableDeviceLoader: state.analytics.currentTab === 'device' ? false : state.analytics.tableDeviceLoader,
          tableAppLoader: state.analytics.currentTab === 'app' ? false : state.analytics.tableAppLoader
        }
      });
    });
  }

  const buildURLParamsForTableList = (groupBy: string, idListArray: any, startDate: Date, endDate: Date): any => {
    let selectedType = '';
    if (groupBy === undefined) {
      groupBy = state.analytics.currentTab;
      selectedType = state.analytics.currentTab;
    } else {
      selectedType = groupBy.toLowerCase() === 'none' ? 'all' : groupBy;
    }
    if (groupBy === 'all') {
      groupBy = 'none';
    }

    const params = {
      groupby: groupBy.toUpperCase(),
      startdate: encodeURI(helper.formatDateWithSlash(startDate)),
      enddate: encodeURI(helper.formatDateWithSlash(endDate)),
      start: state.analytics[selectedType].list.offset,
      limit: state.analytics[selectedType].list.limit
    };
    if (selectedType !== 'all') {
      params['ids'] = idListArray.map(item => item.id).join();
    }
    return params;
  }

  const buildURLParams = (groupBy: string, idListArray: any, startDate: Date, endDate: Date, period: string): any => {
    let selectedType = '';
    if (groupBy === undefined) {
      groupBy = state.analytics.currentTab;
      selectedType = state.analytics.currentTab;
    } else {
      selectedType = groupBy.toLowerCase() === 'none' ? 'all' : groupBy;
    }
    if (groupBy === 'all') {
      groupBy = 'none';
    }
    const params = {
      groupby: groupBy.toUpperCase(),
      periodtype: period,
      cumulativeFlag: state.analytics[selectedType].chart.filter.cummulative,
      startdate: encodeURI(helper.formatDateWithSlash(startDate)),
      enddate: encodeURI(helper.formatDateWithSlash(endDate))
    };
    if (selectedType !== 'all') {
      params['ids'] = idListArray.map(item => item.id).join();
    }
    return params;
  }

  const a11yProps = (index: number): any => {
    return {
      id: `analytics-tab-${index}`,
      'aria-controls': `analytics-tabpanel-${index}`,
    };
  }

  const handleChange = (event: any, newValue: number): void => {
    if (newValue === 0) {
      Mixpanel.track('All Analytics View', { page: 'Preload Analytics Page View' });
    } else if (newValue === 1) {
      Mixpanel.track('Device Analytics View', { page: 'Preload Analytics Page View' });
    } else if (newValue === 2) {
      Mixpanel.track('App Analytics View', { page: 'Preload Analytics Page View' });
    }

    setTabIndex(newValue);
    dispatch({
      type: "UPDATE_ANALYTICS_ACTIVE_TAB",
      payload: tabList[newValue]
    });
  };

  const TabPanel = (props: any): any => {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        role="tabpanel"
        id={`analytics-tabpanel-${index}`}
        aria-labelledby={`analytics-tab-${index}`}
        className={(value !== index) ? "hidden" : ""}
        {...other}
      >
        <Box>
          <Typography>{children}</Typography>
        </Box>
      </Typography>
    );
  }

  const getAnalyticsChartData = (groupBy: string = "NONE", idListArray: any = [], startDate: Date, endDate: Date, forcePeriodFlag: boolean = false): void => {
    const type = ((groupBy === "NONE") ? 'all' : groupBy).toLowerCase();
    let periodValue = state.analytics[type].chart.filter.period;
    if (!forcePeriodFlag) {
      if (getDateDiffByDay(startDate, endDate) > 2 && state.analytics[type].chart.filter.period === 'HOUR') {
        periodValue = 'DAY';
      } else if (getDateDiffByDay(startDate, endDate) > 62 && state.analytics[type].chart.filter.period === 'DAY') {
        periodValue = 'MONTH';
      } else if (getDateDiffByDay(startDate, endDate) < 31 && state.analytics[type].chart.filter.period === 'MONTH') {
        periodValue = 'DAY';
      } else if (getDateDiffByDay(startDate, endDate) >= 365 && (state.analytics[type].chart.filter.period === 'MONTH' || state.analytics[type].chart.filter.period === 'DAY')) {
        periodValue = 'YEAR';
      } else if (getDateDiffByDay(startDate, endDate) < 365 && state.analytics[type].chart.filter.period === 'YEAR') {
        if (getDateDiffByDay(startDate, endDate) < 31) {
          periodValue = 'DAY';
        } else {
          periodValue = 'MONTH';
        }
      }
    } else {
      periodValue = state.analytics[type].chart.filter.period;

    }
    const urlParams = {
      params: buildURLParams(groupBy, idListArray, startDate, endDate, periodValue)
    };

    if (state.analytics.currentTab === 'all' && type === 'all') {
      dispatch({
        type: "TOGGLE_CHART_LOADER_ALL",
        payload: {
          chartAllLoader: true
        }
      })
    } else if (state.analytics.currentTab === 'channel' && type === 'channel') {
      dispatch({
        type: "TOGGLE_CHART_LOADER_CHANNEL",
        payload: {
          chartChannelLoader: true
        }
      })
    } else if (state.analytics.currentTab === 'device' && type === 'device') {
      dispatch({
        type: "TOGGLE_CHART_LOADER_DEVICE",
        payload: {
          chartDeviceLoader: true
        }
      })
    } else if (state.analytics.currentTab === 'app' && type === 'app') {
      dispatch({
        type: "TOGGLE_CHART_LOADER_APP",
        payload: {
          chartAppLoader: true
        }
      })
    }
    apiDashboard
      .get(`/preload/analytics/organizationid/${organizationId}/totalcounts`, urlParams)
      .then(response => {
        dispatch({
          type: "UPDATE_ANALYTICS_CHART_DATA",
          payload: {
            data: {
              dataX: response?.data?.data?.dataX,
              dataY: response?.data?.data?.dataY
            },
            filter: {
              cummulative: state.analytics[type].chart.filter.cummulative,
              period: periodValue
            },
            tab: type
          }
        });
        if (state.analytics.currentTab === 'all' && type === 'all') {
          dispatch({
            type: "TOGGLE_CHART_LOADER_ALL",
            payload: {
              chartAllLoader: false
            }
          })
        } else if (state.analytics.currentTab === 'channel' && type === 'channel') {
          dispatch({
            type: "TOGGLE_CHART_LOADER_CHANNEL",
            payload: {
              chartChannelLoader: false
            }
          })
        } else if (state.analytics.currentTab === 'device' && type === 'device') {
          dispatch({
            type: "TOGGLE_CHART_LOADER_DEVICE",
            payload: {
              chartDeviceLoader: false
            }
          })
        } else if (state.analytics.currentTab === 'app' && type === 'app') {
          dispatch({
            type: "TOGGLE_CHART_LOADER_APP",
            payload: {
              chartAppLoader: false
            }
          })
        }
      }, error => {
        console.log(error);
        dispatch({
          type: "UPDATE_ANALYTICS_CHART_DATA",
          payload: {
            data: {
              dataX: [],
              dataY: []
            },
            filter: {
              cummulative: state.analytics[type].chart.filter.cummulative,
              period: state.analytics[type].chart.filter.period
            },
            tab: type
          }
        });
        if (state.analytics.currentTab === 'all' && type === 'all') {
          dispatch({
            type: "TOGGLE_CHART_LOADER_ALL",
            payload: {
              chartAllLoader: false
            }
          })
        } else if (state.analytics.currentTab === 'channel' && type === 'channel') {
          dispatch({
            type: "TOGGLE_CHART_LOADER_CHANNEL",
            payload: {
              chartChannelLoader: false
            }
          })
        } else if (state.analytics.currentTab === 'device' && type === 'device') {
          dispatch({
            type: "TOGGLE_CHART_LOADER_DEVICE",
            payload: {
              chartDeviceLoader: false
            }
          })
        } else if (state.analytics.currentTab === 'app' && type === 'app') {
          dispatch({
            type: "TOGGLE_CHART_LOADER_APP",
            payload: {
              chartAppLoader: false
            }
          })
        }
      });
  };

  const setDates = (range: any): any => {
    setDateRange(range);
    dispatch({
      type: "SET_DATE",
      payload: {
        from: range.hasOwnProperty('startDate') ? range.startDate : state.analytics.dateRange.from,
        to: range.hasOwnProperty('endDate') ? range.endDate : state.analytics.dateRange.to,
        tab: state.analytics.currentTab
      }
    })
    getAnalyticsChartData('all', [], range.hasOwnProperty('startDate') ? range.startDate : state.analytics.dateRange.from, range.hasOwnProperty('endDate') ? range.endDate : state.analytics.dateRange.to);
    // getAnalyticsChartData('channel', state.analytics.selectedChannelList, range.hasOwnProperty('startDate') ? range.startDate : state.analytics.dateRange.from, range.hasOwnProperty('endDate') ? range.endDate : state.analytics.dateRange.to);
    getAnalyticsChartData('device', state.analytics.selectedDeviceList, range.hasOwnProperty('startDate') ? range.startDate : state.analytics.dateRange.from, range.hasOwnProperty('endDate') ? range.endDate : state.analytics.dateRange.to);
    getAnalyticsChartData('app', state.analytics.selectedAppList, range.hasOwnProperty('startDate') ? range.startDate : state.analytics.dateRange.from, range.hasOwnProperty('endDate') ? range.endDate : state.analytics.dateRange.to);
    getActiveAllTableList('all', [], range.hasOwnProperty('startDate') ? range.startDate : state.analytics.dateRange.from, range.hasOwnProperty('endDate') ? range.endDate : state.analytics.dateRange.to);
    // getActiveChannelTableList('channel', state.analytics.selectedChannelList, range.hasOwnProperty('startDate') ? range.startDate : state.analytics.dateRange.from, range.hasOwnProperty('endDate') ? range.endDate : state.analytics.dateRange.to);
    getActiveDeviceTableList('device', state.analytics.selectedDeviceList, range.hasOwnProperty('startDate') ? range.startDate : state.analytics.dateRange.from, range.hasOwnProperty('endDate') ? range.endDate : state.analytics.dateRange.to);
    getActiveAppTableList('app', state.analytics.selectedAppList, range.hasOwnProperty('startDate') ? range.startDate : state.analytics.dateRange.from, range.hasOwnProperty('endDate') ? range.endDate : state.analytics.dateRange.to);
  }

  const getDateDiffByDay = (startDate: Date, endDate: Date): number => {
    let diff;
    if (startDate && endDate) {
      diff = Math.ceil((Math.abs(endDate.getTime() - startDate.getTime())) / (1000 * 3600 * 24));
    }
    return diff;
  }

  return (
    <React.Fragment>
      <S.Container className="inner-container  position-relative">
        <Breadcrumb hierarchy={hierarchyList} />
        <div className="mb-20 position-relative">
          <div>
            <h1 className="page-title">{t('PRELOAD_PROFILE')}</h1>
          </div>

          <div className="header-main-btn calandar-btn">
            <TextField
              onChange={setDates}
              onClick={() => setOpen(!open)}
              value={`${helper.formatDateWithSlash(dateRange.startDate)} - ${helper.formatDateWithSlash(dateRange.endDate)}`}
              type="text"
              variant="outlined"
              autoFocus={true}
              aria-describedby="desc-search-text"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="start" className="calandar-icon">
                    <DateRangeTwoToneIcon />
                  </InputAdornment>
                )
              }}
            />
            {open && <div className="calandar-popup" ref={inputRef}>
              <DateRangePicker
                ranges={[dateRange]}
                onChange={(item) => setDates(item.selection)}
                months={2}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                showMonthAndYearPickers={false}
                direction="horizontal"
                maxDate={new Date()}
                retainEndDateOnFirstSelection={true}
              />
            </div>}
          </div>
          {/* <div>{t('PRELOAD_ANALYTICS_DATE_RANGE_LABEL')}</div> */}
          {/* <p>{t('PRELOAD_ANALYTICS_DATE_RANGE_FROM_LABEL')}</p>
          <SelectDate
            value={state.analytics.dateRange.from}
            required={true}
            onChange={(date) => setDates({ from: date })}
            label={''}
            disablePast={false}
            maxDate={new Date()}
          />
          <p>{t('PRELOAD_ANALYTICS_DATE_RANGE_TO_LABEL')}</p>
          <SelectDate
            value={state.analytics.dateRange.to}
            required={true}
            onChange={(date) => setDates({ to: date })}
            label={''}
            disablePast={false}
            minDate={state.analytics.dateRange.from}
            maxDate={new Date()}
          /> */}

        </div>

        <div className="tabs-wrapper">
          <Tabs value={tabIndex} onChange={handleChange} aria-label="preload analytics tabs" scrollButtons="auto" textColor="secondary">
            <Tab label={t('PRELOAD_ANALYTICS_ALL_TAB')} {...a11yProps(0)} className={tabIndex === 0 ? 'cm-btn-active' : ''} />
            {/* <Tab label={t('PRELOAD_ANALYTICS_CHANNEL_TAB')} {...a11yProps(1)} className={tabIndex === 1 ? 'cm-btn-active' : ''} /> */}
            <Tab label={t('PRELOAD_ANALYTICS_DEVICE_TAB')} {...a11yProps(1)} className={tabIndex === 1 ? 'cm-btn-active' : ''} />
            <Tab label={t('PRELOAD_ANALYTICS_APP_TAB')} {...a11yProps(2)} className={tabIndex === 2 ? 'cm-btn-active' : ''} />
          </Tabs>
        </div>
        <div className="tab-panel-wrapper">
          <TabPanel value={tabIndex} index={0}>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>
                <AnalyticsCard type="all"
                  getAnalyticsChartData={getAnalyticsChartData} />
              </Grid>
            </Grid>
          </TabPanel>
          {/* <TabPanel value={tabIndex} index={1}>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>
                <AnalyticsCard type="channel"
                  getAnalyticsChartData={getAnalyticsChartData}
                  getActiveChannelTableList={getActiveChannelTableList} />
              </Grid>
            </Grid>
          </TabPanel> */}
          <TabPanel value={tabIndex} index={1}>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>
                <AnalyticsCard type="device"
                  getAnalyticsChartData={getAnalyticsChartData}
                  getActiveDeviceTableList={getActiveDeviceTableList} />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>
                <AnalyticsCard type="app"
                  getAnalyticsChartData={getAnalyticsChartData}
                  getActiveAppTableList={getActiveAppTableList} />
              </Grid>
            </Grid>
          </TabPanel>
        </div>
      </S.Container>
    </React.Fragment>
  );
}

export default PreloadAnalytics;



