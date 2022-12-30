const orgData = JSON.parse(localStorage.getItem('dr-user')).organizations;
const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
const orgIndex = orgData.findIndex(org => org.id === organizationId);
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";

const VirtualPreloadReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_MANAGEMENT_TAB':
            return {
                ...state,
                currentTab: action.payload.currentTab,
            };
        case 'CHANGE_CHANNEL_VALUE':
            return {
                ...state,
                channelId: action.payload.channelId,
                numberOfSlots: action.payload.numberOfSlots,
            };
        case 'GET_DEVICE_DATA':
            return {
                ...state,
                deviceData: action.payload.data
            }
        case 'ENABLE_SLOTS':
            return {
                ...state,
                enabledSlots: action.payload.enabledSlots,
            };
        case 'SETTING_STEP':
            return {
                ...state,
                settingStep: action.payload.settingStep,
            };
        case 'ONCHANGE_CHECKBOX':
            return {
                ...state,
                items: action.payload.items,
            };
        case 'UPDATE_PRELOADPROFILE':
            return {
                ...state,
                currentApps: action.payload.currentApps,
                status: action.payload.status,
            };
        case 'UPDATE_CHANNEL':
            return {
                ...state,
                channelId: action.payload.channelId,
                items: action.payload.items,
            };
        case 'UPDATE_PRELOADPROFILE_ALLSTATE':
            return {
                ...state,
                id: action.payload.id,
                items: action.payload.items,
                enabledSlots: action.payload.enabledSlots,
                numberOfSlots: action.payload.numberOfSlots,
                initialItems: action.payload.initialItems,
                currentCols: action.payload.currentCols,
                settingStep: action.payload.settingStep
            };
        case 'UPDATE_SELECTED_DEVICE':
            return {
                ...state,
                selectedDevicesToProfile: action.payload.selectedDevicesToProfile
            }
        case 'TOGGLE_LOADER':
            return {
                ...state,
                toggleLoader: action.payload
            }
        case 'GET_CHANNEL_LIST':
            return {
                ...state,
                channelList: action.payload
            }
        case 'SET_CHANNEL':
            return {
                ...state,
                selectedChannelId: action.payload
            }
        case 'GET_DEVICE_LIST':
            return {
                ...state,
                deviceList: action.payload
            }
        case 'GET_APP_LIST':
            return {
                ...state,
                appList: action.payload
            }
        case 'GET_PROFILE':
            return {
                ...state,
                publishedProfile: action.payload.publishedProfile,
                unPublishedProfile: action.payload.unPublishedProfile,
                isSlotModified: action.payload.isSlotModified,
                isCellModified: action.payload.isCellModified,
                enabledSlotsBeforeModification: action.payload.enabledSlotsBeforeModification,
                deviceListBeforeModification: action.payload.deviceListBeforeModification,
                profileErrorStatus404: action.payload.profileErrorStatus404,
                scrollPosition: action.payload.scrollPosition,
                selectedNoOfSlots: action.payload.selectedNoOfSlots,
                profileApiResponseSlots: action.payload.profileApiResponseSlots
            }
        case 'RESET_STATE':
            return {
                ...state,
                channelList: action.payload.channelList,
                selectedChannelId: action.payload.selectedChannelId,
                appList: action.payload.appList,
                deviceList: action.payload.deviceList,
                publishedProfile: action.payload.publishedProfile,
                unPublishedProfile: action.payload.unPublishedProfile,
                isSlotModified: action.payload.isSlotModified,
                isCellModified: action.payload.isCellModified,
                enabledSlotsBeforeModification: action.payload.enabledSlotsBeforeModification,
                deviceListBeforeModification: action.payload.deviceListBeforeModification,
                profileErrorStatus404: action.payload.profileErrorStatus404,
                selectedNoOfSlots: action.payload.selectedNoOfSlots,
                scrollPosition: action.payload.scrollPosition,
                profileApiResponseSlots: action.payload.profileApiResponseSlots
            }
        case "UPDATE_ANALYTICS_ACTIVE_TAB":
            return {
                ...state,
                analytics: {
                    ...state.analytics,
                    ...{ currentTab: action.payload }
                }
            };
        case "UPDATE_ANALYTICS_FILTER":
            return {
                ...state,
                analytics: {
                    ...state.analytics,
                    [state.analytics.currentTab]: {
                        ...state.analytics[state.analytics.currentTab],
                        chart: {
                            ...state.analytics[state.analytics.currentTab].chart,
                            filter: {
                                ...action.payload
                            }
                        }
                    }
                }
            };
        case "UPDATE_ANALYTICS_CHART_DATA":
            return {
                ...state,
                analytics: {
                    ...state.analytics,
                    [action.payload.tab]: {
                        ...state.analytics[action.payload.tab],
                        chart: {
                            ...state.analytics[action.payload.tab].chart,
                            data: {
                                ...action.payload.data
                            },
                            filter: {
                                period: action.payload.filter.period,
                                cummulative: action.payload.filter.cummulative
                            }
                        }
                    }
                }
            };
        case "UPDATE_ANALYTICS_LIST_DATA":
            return {
                ...state,
                analytics: {
                    ...state.analytics,
                    [action.payload.tab]: {
                        ...state.analytics[action.payload.tab],
                        list: {
                            ...state.analytics[action.payload.tab].list,
                            data: {
                                ...action.payload.data
                            },
                            hasMore: action.payload.hasMore,
                            offset: action.payload.offset,
                            limit: action.payload.limit,
                            sortOrder: action.payload.sortOrder,
                            sortColumn: action.payload.sortColumn
                        }
                    }
                }
            };
        case "SET_CHANNEL_DATA":
            return {
                ...state,
                analytics: {
                    ...state.analytics,
                    channelList: action.payload.channelList,
                    selectedChannelList: action.payload.selectedChannelList,
                    selectedChannelIdList: action.payload.selectedChannelIdList
                }
            }
        case "SET_DEVICE_DATA":
            return {
                ...state,
                analytics: {
                    ...state.analytics,
                    deviceList: action.payload.deviceList,
                    selectedDeviceList: action.payload.selectedDeviceList,
                    selectedDeviceIdList: action.payload.selectedDeviceIdList
                }
            }
        case "SET_APP_DATA":
            return {
                ...state,
                analytics: {
                    ...state.analytics,
                    appList: action.payload.appList,
                    selectedAppList: action.payload.selectedAppList,
                    selectedAppIdList: action.payload.selectedAppIdList
                }
            }
        case "SET_DATE":
            return {
                ...state,
                analytics: {
                    ...state.analytics,
                    dateRange: {
                        from: action.payload.from,
                        to: action.payload.to
                    }

                }
            }
        case "TOGGLE_TABLE_LOADER":
            return {
                ...state,
                analytics: {
                    ...state.analytics,
                    tableAllLoader: action.payload.tableAllLoader,
                    tableChannelLoader: action.payload.tableChannelLoader,
                    tableDeviceLoader: action.payload.tableDeviceLoader,
                    tableAppLoader: action.payload.tableAppLoader
                }
            }
        case "TOGGLE_CHART_LOADER_ALL":
            return {
                ...state,
                analytics: {
                    ...state.analytics,
                    chartAllLoader: action.payload.chartAllLoader
                }
            }
        case "TOGGLE_CHART_LOADER_CHANNEL":
            return {
                ...state,
                analytics: {
                    ...state.analytics,
                    chartChannelLoader: action.payload.chartChannelLoader
                }
            }
        case "TOGGLE_CHART_LOADER_DEVICE":
            return {
                ...state,
                analytics: {
                    ...state.analytics,
                    chartDeviceLoader: action.payload.chartDeviceLoader
                }
            }
        case "TOGGLE_CHART_LOADER_APP":
            return {
                ...state,
                analytics: {
                    ...state.analytics,
                    chartAppLoader: action.payload.chartAppLoader
                }
            }
        case "RESET_STATE_ANALYTICS":
            return {
                ...state,
                analytics: {
                    currentTab: 'all',
                    dateRange: {
                        from: new Date(helper.convertDateByTimeZone(
                            orgData[orgIndex]?.timeZone
                        ).getTime() - (2 * 24 * 60 * 60 * 1000)),
                        to: helper.convertDateByTimeZone(
                            orgData[orgIndex]?.timeZone)
                    },
                    channelList: [],
                    appList: [],
                    deviceList: [],
                    selectedChannelList: [],
                    selectedChannelIdList: [],
                    selectedAppList: [],
                    selectedAppIdList: [],
                    selectedDeviceList: [],
                    selectedDeviceIdList: [],
                    chartAllLoader: false,
                    chartChannelLoader: false,
                    chartDeviceLoader: false,
                    chartAppLoader: false,
                    tableChannelLoader: false,
                    tableDeviceLoader: false,
                    tableAppLoader: false,
                    all: {
                        chart: {
                            filter: {
                                cummulative: true,
                                period: 'DAY'
                            },
                            data: {
                                dataX: [],
                                dataY: []
                            }
                        },
                        list: {
                            data: {
                                columns: [],
                                values: []
                            },
                            offset: 0,
                            limit: 10,
                            hasMore: false,
                            sortOrder: 'desc',
                            sortColumn: 'Channel'
                        }
                    },
                    device: {
                        chart: {
                            filter: {
                                cummulative: true,
                                period: 'DAY'
                            },
                            data: {
                                dataX: [],
                                dataY: []
                            }
                        },
                        list: {
                            data: {
                                columns: [],
                                values: []
                            },
                            offset: 0,
                            limit: 10,
                            hasMore: false,
                            sortOrder: 'desc',
                            sortColumn: 'App Name'
                        }
                    },
                    channel: {
                        chart: {
                            filter: {
                                cummulative: true,
                                period: 'DAY'
                            },
                            data: {
                                dataX: [],
                                dataY: []
                            }
                        },
                        list: {
                            data: {
                                columns: [],
                                values: []
                            },
                            offset: 0,
                            limit: 10,
                            hasMore: false,
                            sortOrder: 'desc',
                            sortColumn: 'Channel'
                        }
                    },
                    app: {
                        chart: {
                            filter: {
                                cummulative: true,
                                period: 'DAY'
                            },
                            data: {
                                dataX: [],
                                dataY: []
                            }
                        },
                        list: {
                            data: {
                                columns: [],
                                values: []
                            },
                            offset: 0,
                            limit: 10,
                            hasMore: false,
                            sortOrder: 'desc',
                            sortColumn: 'Channel'
                        }
                    }
                }
            }
        case "SNACKBAR_APP":
            return {
                ...state,
                management: {
                    ...state.management,
                    app: {
                        showSnackBar: action.payload.showSnackBar,
                        showSnackBarSuccess: action.payload.showSnackBarSuccess,
                        snackBarMessageValue: action.payload.snackBarMessageValue
                    }
                }
            }
        case "SNACKBAR_DEVICE":
            return {
                ...state,
                management: {
                    ...state.management,
                    device: {
                        showSnackBar: action.payload.showSnackBar,
                        showSnackBarSuccess: action.payload.showSnackBarSuccess,
                        snackBarMessageValue: action.payload.snackBarMessageValue
                    }
                }
            }
        case "SNACKBAR_CHANNEL":
            return {
                ...state,
                management: {
                    ...state.management,
                    channel: {
                        showSnackBar: action.payload.showSnackBar,
                        showSnackBarSuccess: action.payload.showSnackBarSuccess,
                        snackBarMessageValue: action.payload.snackBarMessageValue
                    }
                }
            }
        case "RESET_STATE_MANAGEMENT":
            return {
                ...state,
                management: {
                    app: {
                        showSnackBar: false,
                        showSnackBarSuccess: false,
                        snackBarMessageValue: ''
                    },
                    device: {
                        showSnackBar: false,
                        showSnackBarSuccess: false,
                        snackBarMessageValue: ''
                    },
                    channel: {
                        showSnackBar: false,
                        showSnackBarSuccess: false,
                        snackBarMessageValue: ''
                    }
                }
            }
        default:
            return state;
    }
}
export default VirtualPreloadReducer;
