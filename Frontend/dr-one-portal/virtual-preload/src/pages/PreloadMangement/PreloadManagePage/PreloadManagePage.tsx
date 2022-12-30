import React, { useState, useEffect, useContext } from "react";
import {
    Button,
    Tab,
    Tabs,
    Typography,
    Box
} from "@material-ui/core";
import * as S from "./PreloadManagePage.styles";
import PreloadManageTable from "../PreloadManageTable/PreloadManageTable";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { apiDashboard, helper } from "@dr-one/utils";
import { Breadcrumb } from "@dr-one/shared-component";
import { userHasPermission, Mixpanel } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';
import { GlobalContext } from '../../../context/globalState';

const canEnablePreloadApp = (): boolean => {
    return userHasPermission(['C_PRELOAD_SUPPORTED_APP', 'C_PRELOAD_SUPPORTED_APP_OWN_ORG', 'R_PRELOAD_SUPPORTED_APP', 'R_PRELOAD_SUPPORTED_APP_OWN', 'R_PRELOAD_SUPPORTED_APP_OWN_ORG']);
}

const canEnablePreloadDevice = (): boolean => {
    return userHasPermission(['C_PRELOAD_SUPPORTED_DEVICE', 'C_PRELOAD_SUPPORTED_DEVICE_OWN_ORG', 'R_PRELOAD_SUPPORTED_DEVICE', 'R_PRELOAD_SUPPORTED_DEVICE_OWN', 'R_PRELOAD_SUPPORTED_DEVICE_OWN_ORG']);
}

const canEnablePreloadChannel = (): boolean => {
    return userHasPermission(['C_PRELOAD_CHANNEL', 'C_PRELOAD_CHANNEL_OWN_ORG', 'R_PRELOAD_CHANNEL', 'R_PRELOAD_CHANNEL_OWN', 'R_PRELOAD_CHANNEL_OWN_ORG']);
}

const setTabIndexValue = () => {
    if (canEnablePreloadApp() && canEnablePreloadDevice() && canEnablePreloadChannel()) {
        return 0;
    } else if (!canEnablePreloadApp() && canEnablePreloadDevice() && canEnablePreloadChannel()) {
        return 1;
    }
    // else if (!canEnablePreloadApp() && !canEnablePreloadDevice() && canEnablePreloadChannel()) {
    //     return 2;
    // } 
    else if (canEnablePreloadApp() && !canEnablePreloadDevice() && !canEnablePreloadChannel()) {
        return 0;
    } else if (!canEnablePreloadApp() && canEnablePreloadDevice() && !canEnablePreloadChannel()) {
        return 1;
    }
}

function PreloadManage() {
    const { dispatch } = useContext(GlobalContext);
    const [tabIndex, setTabIndex] = React.useState(setTabIndexValue());
    const [preloadListApp, setPreloadListApp] = React.useState<any>([]);
    const [preloadListChannel, setPreloadListChannel] = React.useState<any>([]);
    const [preloadListDevice, setPreloadListDevice] = React.useState<any>([]);
    const [preloadListWithoutFiltersApp, setPreloadListWithoutFilteresApp] = React.useState<any>([]);
    const [preloadListWithoutFiltersChannel, setPreloadListWithoutFilteresChannel] = React.useState<any>([]);
    const [preloadListWithoutFiltersDevice, setPreloadListWithoutFilteresDevice] = React.useState<any>([]);
    const [pageApp, setPageApp] = React.useState(1);
    const [pageDevice, setPageDevice] = React.useState(1);
    const [pageChannel, setPageChannel] = React.useState(1);

    const [sortColumnApp, setSortColumnApp] = React.useState('updatedAt');
    const [sortOrderApp, setSortOrderApp] = React.useState('desc');
    const [sortColumnDevice, setSortColumnDevice] = React.useState('updatedAt');
    const [sortOrderDevice, setSortOrderDevice] = React.useState('desc');
    // const [sortColumnChannel, setSortColumnChannel] = React.useState('updatedAt');
    // const [sortOrderChannel, setSortOrderChannel] = React.useState('desc');

    const [searchTextApp, setSearchTextApp] = React.useState('');
    const [searchTextDevice, setSearchTextDevice] = React.useState('');
    // const [searchTextChannel, setSearchTextChannel] = React.useState('');

    const [isShowLoaderApp, toggleLoaderApp] = React.useState(false);
    const [isShowLoaderDevice, toggleLoaderDevice] = React.useState(false);
    // const [isShowLoaderChannel, toggleLoaderChannel] = React.useState(false);

    const [actionListStatusApp, setActionListStatusApp] = React.useState(false);
    const [actionListStatusDevice, setActionListStatusDevice] = React.useState(false);
    // const [actionListStatusChannel, setActionListStatusChannel] = React.useState(false);

    const [actionListIndexApp, setActionListIndexApp] = React.useState(null);
    const [actionListIndexDevice, setActionListIndexDevice] = React.useState(null);
    // const [actionListIndexChannel, setActionListIndexChannel] = React.useState(null);

    const [isOpenAppPopup, toggleAppPopup] = React.useState(false);
    const [isOpenDevicePopup, toggleDevicePopup] = React.useState(false);
    // const [isOpenChannelPopup, toggleChannelPopup] = React.useState(false);
    const [activeRowApp, setActiveRowApp] = React.useState(Object);
    const [activeRowDevice, setActiveRowDevice] = React.useState(Object);
    // const [activeRowChannel, setActiveRowChannel] = React.useState(Object);
    const [operationTypeApp, setOperationTypeApp] = useState('Create New');
    const [operationTypeDevice, setOperationTypeDevice] = useState('Create New');
    // const [operationTypeChannel, setOperationTypeChannel] = useState('Create New');
    const { t } = useTranslation();
    const organizationId = JSON.parse(localStorage.getItem('dr-user'))?.organizationActive;

    useEffect(() => {
        toggleLoaderApp(true);
        toggleLoaderDevice(true);
        // toggleLoaderChannel(true);

        apiDashboard
            .get(`preload/supportedapp/organizationid/${organizationId}`)
            .then(response => {
                toggleLoaderApp(false);
                setPreloadListApp(helper.sort(response.data.data, { property: sortColumnApp, direction: sortOrderApp === 'desc' ? -1 : 1 }));
                setPreloadListWithoutFilteresApp(helper.sort(response.data.data, { property: sortColumnApp, direction: sortOrderApp === 'desc' ? -1 : 1 }));
                setPreloadListWithoutFilteresDevice(preloadListWithoutFiltersDevice => preloadListWithoutFiltersDevice);
                setPreloadListWithoutFilteresChannel(preloadListWithoutFiltersChannel => preloadListWithoutFiltersChannel);
                setActionListStatusApp(actionListStatusApp => actionListStatusApp);
                setActionListStatusDevice(actionListStatusDevice => actionListStatusDevice);
                // setActionListStatusChannel(actionListStatusChannel => actionListStatusChannel);
                setActionListIndexApp(actionListIndexApp => actionListIndexApp);
                setActionListIndexDevice(actionListIndexDevice => actionListIndexDevice);
                // setActionListIndexChannel(actionListIndexChannel => actionListIndexChannel);
                setSearchTextApp(searchTextApp => searchTextApp);
                setSearchTextDevice(searchTextDevice => searchTextDevice);
                setSearchTextDevice(searchTextChannel => searchTextChannel);
                toggleAppPopup(isOpenAppPopup => isOpenAppPopup);
                // toggleChannelPopup(isOpenChannelPopup => isOpenChannelPopup);
                toggleDevicePopup(isOpenDevicePopup => isOpenDevicePopup);
            }, error => {
                toggleLoaderApp(false);
                setPreloadListApp([]);
                setPreloadListWithoutFilteresApp([]);
                setPreloadListWithoutFilteresDevice(preloadListWithoutFiltersDevice => preloadListWithoutFiltersDevice);
                setPreloadListWithoutFilteresChannel(preloadListWithoutFiltersChannel => preloadListWithoutFiltersChannel);
                setActionListStatusApp(actionListStatusApp => actionListStatusApp);
                setActionListStatusDevice(actionListStatusDevice => actionListStatusDevice);
                // setActionListStatusChannel(actionListStatusChannel => actionListStatusChannel);
                setActionListIndexApp(null);
                setActionListIndexDevice(actionListIndexDevice => actionListIndexDevice);
                // setActionListIndexChannel(actionListIndexChannel => actionListIndexChannel);
                setSearchTextApp(searchTextApp => searchTextApp);
                setSearchTextDevice(searchTextDevice => searchTextDevice);
                setSearchTextDevice(searchTextChannel => searchTextChannel);
                toggleAppPopup(isOpenAppPopup => isOpenAppPopup);
                // toggleChannelPopup(isOpenChannelPopup => isOpenChannelPopup);
                toggleDevicePopup(isOpenDevicePopup => isOpenDevicePopup);
            });
        apiDashboard
            .get(`preload/supporteddevice/organizationid/${organizationId}`)
            .then(response => {
                toggleLoaderDevice(false);
                setPreloadListDevice(helper.sort(response.data.data, { property: sortColumnDevice, direction: sortOrderDevice === 'desc' ? -1 : 1 }));
                setPreloadListWithoutFilteresApp(preloadLiWithoutFiltersApp => preloadLiWithoutFiltersApp);
                setPreloadListWithoutFilteresDevice(helper.sort(response.data.data, { property: sortColumnDevice, direction: sortOrderDevice === 'desc' ? -1 : 1 }));
                setPreloadListWithoutFilteresChannel(preloadListWithoutFiltersChannel => preloadListWithoutFiltersChannel);
                setActionListStatusApp(actionListStatusApp => actionListStatusApp);
                setActionListStatusDevice(actionListStatusDevice => actionListStatusDevice);
                // setActionListStatusChannel(actionListStatusChannel => actionListStatusChannel);
                setActionListIndexApp(actionListIndexApp => actionListIndexApp);
                setActionListIndexDevice(actionListIndexDevice => actionListIndexDevice);
                // setActionListIndexChannel(actionListIndexChannel => actionListIndexChannel);
                setSearchTextApp(searchTextApp => searchTextApp);
                setSearchTextDevice(searchTextDevice => searchTextDevice);
                setSearchTextDevice(searchTextChannel => searchTextChannel);
                toggleAppPopup(isOpenAppPopup => isOpenAppPopup);
                // toggleChannelPopup(isOpenChannelPopup => isOpenChannelPopup);
                toggleDevicePopup(isOpenDevicePopup => isOpenDevicePopup);
            }, error => {
                toggleLoaderDevice(false);
                setPreloadListDevice([]);
                setPreloadListWithoutFilteresApp(preloadLiWithoutFiltersApp => preloadLiWithoutFiltersApp);
                setPreloadListWithoutFilteresDevice([]);
                setPreloadListWithoutFilteresChannel(preloadListWithoutFiltersChannel => preloadListWithoutFiltersChannel);
                setActionListStatusApp(actionListStatusApp => actionListStatusApp);
                setActionListStatusDevice(actionListStatusDevice => actionListStatusDevice);
                // setActionListStatusChannel(actionListStatusChannel => actionListStatusChannel);
                setActionListIndexDevice(null);
                setActionListIndexApp(actionListIndexApp => actionListIndexApp);
                // setActionListIndexChannel(actionListIndexChannel => actionListIndexChannel);
                setSearchTextApp(searchTextApp => searchTextApp);
                setSearchTextDevice(searchTextDevice => searchTextDevice);
                setSearchTextDevice(searchTextChannel => searchTextChannel);
                toggleAppPopup(isOpenAppPopup => isOpenAppPopup);
                // toggleChannelPopup(isOpenChannelPopup => isOpenChannelPopup);
                toggleDevicePopup(isOpenDevicePopup => isOpenDevicePopup);
            });
        apiDashboard
            .get(`preload/channel/organizationid/${organizationId}`)
            .then(response => {
                // toggleLoaderChannel(false);
                // setPreloadListChannel(helper.sort(response.data.data, { property: sortColumnChannel, direction: sortOrderChannel === 'desc' ? -1 : 1 }));
                setPreloadListChannel(helper.sort(response.data.data, { property: 'updatedAt', direction: -1 }));
                setPreloadListWithoutFilteresApp(preloadLiWithoutFiltersApp => preloadLiWithoutFiltersApp);
                setPreloadListWithoutFilteresDevice(preloadListWithoutFiltersDevice => preloadListWithoutFiltersDevice);
                // setPreloadListWithoutFilteresChannel(helper.sort(response.data.data, { property: sortColumnChannel, direction: sortOrderChannel === 'desc' ? -1 : 1 }));
                setPreloadListWithoutFilteresChannel(helper.sort(response.data.data, { property: 'updatedAt', direction: -1 }));
                setActionListStatusApp(actionListStatusApp => actionListStatusApp);
                setActionListStatusDevice(actionListStatusDevice => actionListStatusDevice);
                // setActionListStatusChannel(actionListStatusChannel => actionListStatusChannel);
                setActionListIndexApp(actionListIndexApp => actionListIndexApp);
                setActionListIndexDevice(actionListIndexDevice => actionListIndexDevice);
                // setActionListIndexChannel(actionListIndexChannel => actionListIndexChannel);
                setSearchTextApp(searchTextApp => searchTextApp);
                setSearchTextDevice(searchTextDevice => searchTextDevice);
                setSearchTextDevice(searchTextChannel => searchTextChannel);
                toggleAppPopup(isOpenAppPopup => isOpenAppPopup);
                // toggleChannelPopup(isOpenChannelPopup => isOpenChannelPopup);
                toggleDevicePopup(isOpenDevicePopup => isOpenDevicePopup);
            }, error => {
                // toggleLoaderChannel(false);
                setPreloadListChannel([]);
                setPreloadListWithoutFilteresApp(preloadLiWithoutFiltersApp => preloadLiWithoutFiltersApp);
                setPreloadListWithoutFilteresDevice(preloadListWithoutFiltersDevice => preloadListWithoutFiltersDevice);
                setPreloadListWithoutFilteresChannel([]);
                setActionListStatusApp(actionListStatusApp => actionListStatusApp);
                setActionListStatusDevice(actionListStatusDevice => actionListStatusDevice);
                // setActionListStatusChannel(actionListStatusChannel => actionListStatusChannel);
                // setActionListIndexChannel(null);
                setActionListIndexApp(actionListIndexApp => actionListIndexApp);
                setActionListIndexDevice(actionListIndexDevice => actionListIndexDevice);
                setSearchTextApp(searchTextApp => searchTextApp);
                setSearchTextDevice(searchTextDevice => searchTextDevice);
                setSearchTextDevice(searchTextChannel => searchTextChannel);
                toggleAppPopup(isOpenAppPopup => isOpenAppPopup);
                // toggleChannelPopup(isOpenChannelPopup => isOpenChannelPopup);
                toggleDevicePopup(isOpenDevicePopup => isOpenDevicePopup);
            })
        Mixpanel.track("Preload Management List Page View");
        return () => {
            dispatch({
                type: 'RESET_STATE_MANAGEMENT'
            })
        }
    }, []);

    const handleChange = (event: any, newValue: number): void => {
        if (newValue === 0) {
            Mixpanel.track(`App Management View`, { page: 'Preload Management List Page View' });
        } else if (newValue === 1) {
            Mixpanel.track(`Device Management View`, { page: 'Preload Management List Page View' });
        }
        // else if (newValue === 2) {
        //     Mixpanel.track(`Channel Management View`, { page: 'Preload Management List Page View' });
        // }
        setTabIndex(newValue);
        toggleAppPopup(false);
        toggleDevicePopup(false);
        // toggleChannelPopup(false);
        dispatch({
            type: 'SNACKBAR_APP',
            payload: {
                showSnackBar: false,
                showSnackBarSuccess: false,
                snackBarMessageValue: ''
            }
        })
        dispatch({
            type: 'SNACKBAR_DEVICE',
            payload: {
                showSnackBar: false,
                showSnackBarSuccess: false,
                snackBarMessageValue: ''
            }
        })
        dispatch({
            type: 'SNACKBAR_CHANNEL',
            payload: {
                showSnackBar: false,
                showSnackBarSuccess: false,
                snackBarMessageValue: ''
            }
        })
    };

    const a11yProps = (index: number): any => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const TabPanel = (props: any): any => {
        const { children, value, index, ...other } = props;

        return (
            <Typography
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {
                    value === index && (
                        <Box p={3}>
                            <Typography>{children}</Typography>
                        </Box>)
                }
            </Typography>
        );
    }

    const update = (preloadList: any, tabName: number, page: number,
        sortColumn: string, sortOrder: string, searchText: string,
        preloadListWithoutFilters: any): void => {
        // (preloadList: any, tabName: number, page: number,
        //     sortColumn: string, sortOrder: string, searchText: string, isShowSnackBar: boolean = false,
        //     isShowSuccessMessage: boolean = false, snackbarMessage: string = '',
        //     preloadListWithoutFilters: any): void => {
        if (tabName === 0) {
            setPreloadListApp(preloadList);
            setPageApp(page + 1);
            setSortOrderApp(sortOrder);
            setSortColumnApp(sortColumn);
            setSearchTextApp(searchText);
            setPreloadListWithoutFilteresApp(preloadListWithoutFilters);
        } else if (tabName === 1) {
            setPreloadListDevice(preloadList);
            setPageDevice(page + 1);
            setSortOrderDevice(sortOrder);
            setSortColumnDevice(sortColumn);
            setSearchTextDevice(searchText);
            setPreloadListWithoutFilteresDevice(preloadListWithoutFilters);
        } else if (tabName === 2) {
            setPreloadListChannel(preloadList);
            setPageChannel(page + 1);
            // setSortOrderChannel(sortOrder);
            // setSortColumnChannel(sortColumn);
            // setSearchTextChannel(searchText);
            setPreloadListWithoutFilteresChannel(preloadListWithoutFilters);
        }
    }

    const onActionListToggle = (actionStatus: boolean, tabName: number, rowNumber: number, isShowPopup: boolean = false,
        activeRow: object = {}, operationType: string = 'Create New') => {
        // (actionStatus: boolean, tabName: number, rowNumber: number, isShowSnackBar: boolean = false,
        //     isShowSuccessMessage: boolean = false, snackbarMessage: string = '', isShowPopup: boolean = false,
        //     activeRow: object = {}, operationType: string = 'Create New') => {
        if (tabName === 0) {
            setActionListStatusApp(actionStatus);
            setActionListIndexApp(rowNumber);
            toggleAppPopup(isShowPopup);
            setActiveRowApp(activeRow);
            setOperationTypeApp(operationType);
        } else if (tabName === 1) {
            setActionListStatusDevice(actionStatus);
            setActionListIndexDevice(rowNumber);
            toggleDevicePopup(isShowPopup);
            setActiveRowDevice(activeRow);
            setOperationTypeDevice(operationType);
        }
        //  else if (tabName === 2) {
        //     setActionListStatusChannel(actionStatus);
        //     setActionListIndexChannel(rowNumber);
        //     toggleChannelPopup(isShowPopup);
        //     setActiveRowChannel(activeRow);
        //     setOperationTypeChannel(operationType);
        // }
    }

    const openModal = (): void => {
        if (tabIndex === 0) {
            Mixpanel.track('Create App Popup Clicked', { page: 'Preload Management List Page View' });
            toggleAppPopup(true);
        } else if (tabIndex === 1) {
            Mixpanel.track('Create Device Popup Clicked', { page: 'Preload Management List Page View' });
            toggleDevicePopup(true);
        }
        //  else {
        // Mixpanel.track('Create Channel Popup Clicked', { page: 'Preload Management List Page View' });
        //     toggleChannelPopup(true);
        // }
    }

    return (
        <S.Container className="inner-container">
            <Breadcrumb hierarchy={tabIndex === 0 ? [t('VIRTUAL_PRELOAD'), t('APP_MANAGEMENT')]
                : tabIndex === 1 ? [t('VIRTUAL_PRELOAD'), t('DEVICE_MANAGEMENT')] : [t('VIRTUAL_PRELOAD'), t('CHANNEL_MANAGEMENT')]} />
            <div className="mb-20">
                <div>
                    <h1 className="page-title">{t('PRELOAD_PROFILE')}</h1>
                </div>
                {userHasPermission(tabIndex === 0 ? ['C_PRELOAD_SUPPORTED_APP', 'C_PRELOAD_SUPPORTED_APP_OWN_ORG'] : tabIndex === 1 ? ['C_PRELOAD_SUPPORTED_DEVICE', 'C_PRELOAD_SUPPORTED_DEVICE_OWN_ORG'] : ['C_PRELOAD_CHANNEL', 'C_PRELOAD_CHANNEL_OWN_ORG']) && <div className="header-main-btn">
                    <Button variant="contained" color="primary" className="button-lg dark-blue" startIcon={<AddOutlinedIcon fontSize="small" />} onClick={openModal}>{tabIndex === 0 ? t('CREATE_NEW_APP_BUTTON') :
                        tabIndex === 1 ? t('CREATE_NEW_DEVICE_BUTTON') : t('CREATE_NEW_CHANNEL_BUTTON')}</Button>
                </div>}
            </div>

            <div className="tabs-wrapper">
                <Tabs value={tabIndex} onChange={handleChange} aria-label="simple tabs example" scrollButtons="auto"
                    textColor="secondary">
                    {canEnablePreloadApp() && <Tab label={t('APP_MANAGEMENT')} {...a11yProps(0)} className={tabIndex === 0 ? 'cm-btn-active' : ''} />}
                    {canEnablePreloadDevice() && <Tab label={t('DEVICE_MANAGEMENT')} {...a11yProps(1)} className={tabIndex === 1 ? 'cm-btn-active' : ''} />}
                    {/* {canEnablePreloadChannel() && <Tab label={t('CHANNEL_MANAGEMENT')} {...a11yProps(2)} className={tabIndex === 2 ? 'cm-btn-active' : ''} />} */}
                </Tabs>
            </div>
            <div className="table-search-wrap">
                {canEnablePreloadApp() && <TabPanel value={tabIndex} index={0}>
                    <PreloadManageTable active={tabIndex === 0}
                        preloadList={preloadListApp} updatePreloadDetails={update} tabName={tabIndex} page={pageApp}
                        sortOrder={sortOrderApp} sortColumn={sortColumnApp} searchText={searchTextApp} isShowLoader={isShowLoaderApp}
                        actionListStatus={actionListStatusApp} toggleActionList={onActionListToggle} actionListIndex={actionListIndexApp} preloadListWithoutFilters={preloadListWithoutFiltersApp} isOpenPopup={isOpenAppPopup} activeRow={activeRowApp} operationType={operationTypeApp} preloadListChannel={preloadListChannel} />
                </TabPanel>}
                {canEnablePreloadDevice() && <TabPanel value={tabIndex} index={1}>
                    <PreloadManageTable active={tabIndex === 1}
                        preloadList={preloadListDevice} updatePreloadDetails={update} tabName={tabIndex} page={pageDevice}
                        sortOrder={sortOrderDevice} sortColumn={sortColumnDevice} searchText={searchTextDevice} isShowLoader={isShowLoaderDevice}
                        actionListStatus={actionListStatusDevice} toggleActionList={onActionListToggle} actionListIndex={actionListIndexDevice} preloadListWithoutFilters={preloadListWithoutFiltersDevice} isOpenPopup={isOpenDevicePopup} activeRow={activeRowDevice} operationType={operationTypeDevice} />
                </TabPanel>}
                {/* {canEnablePreloadChannel() && <TabPanel value={tabIndex} index={2}>
                    <PreloadManageTable active={tabIndex === 2}
                        preloadList={preloadListChannel} updatePreloadDetails={update} tabName={tabIndex} page={pageChannel}
                        sortOrder={sortOrderChannel} sortColumn={sortColumnChannel} searchText={searchTextChannel} isShowLoader={isShowLoaderChannel}
                        actionListStatus={actionListStatusChannel} toggleActionList={onActionListToggle} actionListIndex={actionListIndexChannel} preloadListWithoutFilters={preloadListWithoutFiltersChannel} isOpenPopup={isOpenChannelPopup} activeRow={activeRowChannel} operationType={operationTypeChannel} />
                </TabPanel>} */}
            </div>
        </S.Container>
    );
}

export default PreloadManage;



