import { createContext, useReducer } from 'react'
import VirtualPreloadReducer from './VirtualPreloadReducer';
import { helper } from "@dr-one/utils";

const orgData = JSON.parse(localStorage.getItem('dr-user')).organizations;
const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;
const orgIndex = orgData.findIndex(org => org.id === organizationId);

const initialState: any = {
    toggleLoader: false,
    id: '',
    channelId: '',
    deviceData: [],
    numberOfSlots: '',
    updatedDate: 'date',
    items: [],
    currentChannels: [],
    currentApps: [],
    settingSt: false,
    counter: 1,
    currentTab: 'app',
    selectedDevicesToProfile: '',
    enabledSlots: [],
    settingStep: '',
    status: 'ACTIVE',
    upload: {
        appIcon: '',
        appName: '',
        appVersionCode: '',
        appVersionName: '',
        channels: [],
        fileId: '',
        fileUrl: '',
        packageName: '',
        shortDescription: '',
    },
    channelList: [],
    selectedChannelId: '',
    selectedNoOfSlots: null,
    profileApiResponseSlots: [],
    deviceList: [],
    appList: [],
    publishedProfile: {},
    unPublishedProfile: {},
    isSlotModified: false,
    isCellModified: false,
    enabledSlotsBeforeModification: [],
    deviceListBeforeModification: [],
    profileErrorStatus404: false,
    scrollPosition: 0,
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
        tableAllLoader: false,
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
    },
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
export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(VirtualPreloadReducer, initialState);

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};