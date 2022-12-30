import React, { useState, useEffect, useRef } from "react";
import * as S from "./VirtualPreloadPopup.styles";
import { apiDashboard, helper, Mixpanel } from "@dr-one/utils";
import { Spinner, LinearBarWithValueLabel } from "@dr-one/shared-component";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {
  TextField,
  Button,
  Modal,
  makeStyles,
  Switch,
  FormControlLabel,
  Grid,
  Checkbox,
  Chip
} from "@material-ui/core";
import FileCopy from "@material-ui/icons/FileCopy";
import Publish from "@material-ui/icons/Publish";
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as yup from 'yup';
import Axios from 'axios';

function VirtualPreloadPopup(props) {
  const useStyles = makeStyles((theme) => ({
    paper: {

    },
    modal: {
      display: 'flex',
      padding: theme.spacing(1),
      alignItems: 'center',
      justifyContent: 'center',
    }
  }));
  const classes = useStyles();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(true);
  const [showLoader, toggleLoader] = useState(false);
  const [status, setStatus] = useState(props.operationType === 'Create New' ? false : props.activeRow.status === 'ACTIVE' ? true : false);
  const [name, setName] = useState(props.operationType === 'Create New' ? '' : props.activeRow.name);
  const [model, setModel] = useState(props.operationType === 'Create New' ? '' : props.activeRow.model);
  const [make, setMake] = useState(props.operationType === 'Create New' ? '' : props.activeRow.make);
  const [channelName, setChannelName] = useState(props.operationType === 'Create New' ? '' : props.activeRow.name);
  const [channelId, setChannelId] = useState(props.operationType === 'Create New' ? '' : props.activeRow.channelId);
  const [channelDescription, setChannelDescription] = useState(props.operationType === 'Create New' ? '' : props.activeRow.description);
  const [slotCount, setSlotCount] = useState(props.operationType === 'Create New' ? 6 : props.activeRow.numberOfSlots);
  const [apiError, setApiError] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [files, setFiles] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');
  const [packageName, setPackageName] = useState(props.operationType === 'Create New' ? '' : props.activeRow.packageName);
  const [appVersionName, setAppVersionName] = useState(props.operationType === 'Create New' ? '' : props.activeRow.appVersionName);
  const [appVersionCode, setAppVersionCode] = useState(props.operationType === 'Create New' ? '' : props.activeRow.appVersionCode);
  const [appIcon, setAppIcon] = useState(props.operationType === 'Create New' ? '' : props.activeRow.appIcon);
  const [fileId, setFileId] = useState(props.operationType === 'Create New' ? '' : props.activeRow.fileId);
  const [fileUrl, setFileUrl] = useState(props.operationType === 'Create New' ? '' : props.activeRow.fileUrl);
  const [appName, setAppName] = useState(props.operationType === 'Create New' ? '' : props.activeRow.appName);
  const [channelList, setChannelList] = useState(props.channelList);
  const [selectedChannelList, setSelectedChannelList] = useState(props.operationType === 'Create New' ? [] : props.activeRow.channels);
  const [defaultChipValue, setDefaultChipValue] = useState([]);
  const [numFiles, setNumFiles] = useState(0);
  const cancelFileUpload = useRef(null);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    if (props.modalType === 'App') {
      const activeChannelIndex = channelList.findIndex(channel => channel.status === 'ACTIVE');
      if (props.operationType === 'Edit') {
        if (activeChannelIndex > -1) {
          if (props.activeRow?.channels && props.activeRow?.channels.includes(channelList[activeChannelIndex]?.id)) {
            setSelectedChannelList([...props.activeRow.channels]);
          } else {
            const associatedChannelList = [...props.activeRow.channels];
            associatedChannelList.push(channelList[activeChannelIndex]?.id);
            setSelectedChannelList(associatedChannelList);
          }
        } else {
          if (props.activeRow?.channels && props.activeRow?.channels.includes(channelList[0]?.id)) {
            setSelectedChannelList([...props.activeRow.channels]);
          } else {
            const associatedChannelList = [...props.activeRow.channels];
            associatedChannelList.push(channelList[0]?.id);
            setSelectedChannelList(associatedChannelList);
          }
        }
      } else {
        const selectedChannels = [];
        if (activeChannelIndex > -1) {
          selectedChannels.push(channelList[activeChannelIndex].id);
          setSelectedChannelList(selectedChannels);
        } else {
          selectedChannels.push(channelList[0].id);
          setSelectedChannelList(selectedChannels);
        }
      }

      // if (props.operationType === 'Edit') {
      //   const channelChipDataList = [];
      //   props.activeRow.channels.forEach(channelData => {
      //     const channelIndex = channelList.findIndex(channel => channel.id === channelData);
      //     if (channelIndex > -1) {
      //       channelChipDataList.push(channelList[channelIndex]);
      //     }
      //   })
      //   setDefaultChipValue(channelChipDataList);
      // }
      // else {
      //   const channelChipDataList = [];
      //   const channelListForCheckBox = [];
      //   props.channelList.forEach((channelData, index) => {
      //     if (index < 5) {
      //       channelChipDataList.push(channelData);
      //       channelListForCheckBox.push(channelData.id);
      //     }
      //   })
      //   setDefaultChipValue(channelChipDataList);
      //   setSelectedChannelList(channelListForCheckBox);
      // }
    }
  }, [])

  const rand = () => {
    return Math.round(Math.random() * 20) - 10;
  }

  const getModalStyle = () => {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  const [modalStyle] = React.useState(getModalStyle);

  const handleClose = (action: string, message: string): void => {
    setOpen(false);
    setFiles('');
    setUploadPercentage(0);
    props.handleOpen(false, action, message);
  };

  const handleChangeStatus = (e: any): void => {
    setStatus(e.target.checked);
  }

  const modifyPayload = (payload: any): void => {
    toggleLoader(true);
    if (props.operationType === 'Create New') {
      apiDashboard.post(props.modalType === 'Device' ? 'preload/supporteddevice' : props.modalType === 'Channel' ? 'preload/channel' : 'preload/supportedapp', payload)
        .then(response => {
          if (props.modalType === 'Device') {
            Mixpanel.track('Device Create Action', { deviceId: response.data.data.id, deviceName: response.data.data.name, page: 'Preload Management List Page View' });
            setName('');
            setMake('');
            setMake('');
          } else if (props.modalType === 'Channel') {
            Mixpanel.track('Channel Create Action', { channelId: response.data.data.id, channelName: response.data.data.name, page: 'Preload Management List Page View' });
            setChannelDescription('');
            setChannelId('');
            setChannelName('');
            setSlotCount(1);
          } else {
            Mixpanel.track('App Create Action', { appId: response.data.data.id, appName: response.data.data.appName, page: 'Preload Management List Page View' });
            setPackageName('');
            setAppIcon('');
            setAppVersionCode('');
            setAppName('');
            setAppVersionCode('');
            setFileId('');
            setFileUrl('');
            setSelectedChannelList([]);
            setDefaultChipValue([]);
          }
          setApiError('');
          handleClose('submit', response.data.message);
          toggleLoader(false);
        }, error => {
          setApiError(helper.getErrorMessage(error));
          toggleLoader(false);
        });
    } else {
      apiDashboard.put(props.modalType === 'Device' ? `preload/supporteddevice/${props.activeRow.id}` : props.modalType === 'Channel' ? `preload/channel/${props.activeRow.id}` : `preload/supportedapp/${props.activeRow.id}`, payload)
        .then(response => {
          if (props.modalType === 'Device') {
            Mixpanel.track('Device Edit Action', { deviceId: props.activeRow.id, deviceName: props.activeRow.name, page: 'Preload Management List Page View' });
            setName('');
            setMake('');
            setMake('');
          } else if (props.modalType === 'Channel') {
            Mixpanel.track('Channel Edit Action', { channelId: props.activeRow.id, channelName: props.activeRow.name, page: 'Preload Management List Page View' });
            setChannelDescription('');
            setChannelId('');
            setChannelName('');
            setSlotCount(1);
          } else {
            Mixpanel.track('App Edit Action', { appId: props.activeRow.id, appName: props.activeRow.appName, page: 'Preload Management List Page View' });
            setPackageName('');
            setAppIcon('');
            setAppVersionCode('');
            setAppName('');
            setAppVersionCode('');
            setFileId('');
            setFileUrl('');
            setSelectedChannelList([]);
            setDefaultChipValue([]);
          }
          setApiError('');
          handleClose('submit', response.data.message);
          toggleLoader(false);
        }, error => {
          setApiError(helper.getErrorMessage(error));
          toggleLoader(false);
        });
    }
  }

  const deletePreloadData = (): void => {
    toggleLoader(true);
    if (props.modalType === 'App') {
      apiDashboard.delete(`preload/supportedapp/${props.activeRow.id}`)
        .then(response => {
          Mixpanel.track('App Delete Action', { appId: props.activeRow.id, appName: props.activeRow.appName, page: 'Preload Management List Page View' });
          toggleLoader(false);
          handleClose('submit', response.data.message);
          setApiError('');
        }, error => {
          setApiError(helper.getErrorMessage(error));
          toggleLoader(false);
        });
    } else if (props.modalType === 'Device') {
      apiDashboard.delete(`preload/supporteddevice/${props.activeRow.id}`)
        .then(response => {
          Mixpanel.track('Device Delete Action', { deviceId: props.activeRow.id, deviceName: props.activeRow.name, page: 'Preload Management List Page View' });
          handleClose('submit', response.data.message);
          toggleLoader(false);
          setApiError('');
        }, error => {
          setApiError(helper.getErrorMessage(error));
          toggleLoader(false);
        });
    } else if (props.modalType === 'Channel') {
      apiDashboard.delete(`preload/channel/${props.activeRow.id}`)
        .then(response => {
          Mixpanel.track('Channel Delete Action', { channelId: props.activeRow.id, channelName: props.activeRow.name, page: 'Preload Management List Page View' });
          handleClose('submit', response.data.message);
          toggleLoader(false);
          setApiError('');
        }, error => {
          setApiError(helper.getErrorMessage(error));
          toggleLoader(false);
        });
    }
  }

  const cancelUpload = () => {
    if (cancelFileUpload.current) {
      cancelFileUpload.current("User has cancel file upload");
    }
  }

  const handleFileUpload = (fileInput: any): void => {
    if (fileInput.target.files && fileInput.target.files.length === 1) {
      const fileExtension = fileInput.target.files[0].name.substring(fileInput.target.files[0].name.lastIndexOf('.') + 1);
      if (fileExtension.toLowerCase() === 'apk') {
        setNumFiles(numFiles => numFiles + fileInput.target.files.length);
        if ((numFiles + fileInput.target.files.length) > 1) {
          cancelUpload();
        }
        setPackageName('');
        setAppVersionName('');
        setAppVersionCode('');
        setAppIcon('');
        setFileId('');
        setFileUrl('');
        setAppName('');
        setApiError('');
        setFiles(fileInput.target.files[0].name);
        const formData: FormData = new FormData();
        formData.append('file', fileInput.target.files[0], fileInput.target.files[0].name);
        formData.append('type', fileInput.target.files[0].type);
        const options = {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percent = Math.floor((loaded * 100) / total);
            setUploadPercentage(percent);
            setFileUploadError('');
          },
          cancelToken: new Axios.CancelToken(
            cancel => (cancelFileUpload.current = cancel)
          )
        }
        apiDashboard
          .post('files/upload', formData, options)
          .then((response) => {
            setPackageName(response.data?.data?.packageName);
            setAppVersionName(response.data?.data?.versionName);
            setAppVersionCode(response.data?.data?.versionCode);
            setAppIcon(response.data?.data?.iconPath);
            setFileId(response.data?.data?.id);
            setFileUrl(response.data?.data?.url);
            setAppName(response.data?.data?.appName);
          }, error => {
            setFileUploadError(helper.getErrorMessage(error));
            setPackageName('');
            setAppVersionName('');
            setAppVersionCode('');
            setAppIcon('');
            setFileId('');
            setFileUrl('');
            setAppName('');
            setUploadPercentage(0);
            setFiles('');
          });
      } else {
        setFileUploadError(t('PRELOAD_MANAGE_POPUP_App_APK_FILE_UPLOAD_INVALID_FORMAT_ERROR'));
        setPackageName('');
        setAppVersionName('');
        setAppVersionCode('');
        setAppIcon('');
        setFileId('');
        setFileUrl('');
        setAppName('');
        setUploadPercentage(0);
        setFiles('');
      }
    }
  };

  const renderElementLabels = (): string => {
    if (props.modalType === 'App') {
      if (props.operationType === 'Create New') {
        return t('PRELOAD_MANAGAE_POPUP_CREATE_APP_LABEL');
      } else if (props.operationType === 'Edit') {
        return t('PRELOAD_MANAGAE_POPUP_EDIT_APP_LABEL');
      } else {
        return t('PRELOAD_MANAGAE_POPUP_DELETE_APP_LABEL');
      }
    } else if (props.modalType === 'Device') {
      if (props.operationType === 'Create New') {
        return t('PRELOAD_MANAGAE_POPUP_CREATE_DEVICE_LABEL');
      } else if (props.operationType === 'Edit') {
        return t('PRELOAD_MANAGAE_POPUP_EDIT_DEVICE_LABEL');
      } else {
        return t('RELOAD_MANAGAE_POPUP_DELETE_DEVICE_LABEL');
      }
    } else if (props.modalType === 'Channel') {
      if (props.operationType === 'Create New') {
        return t('PRELOAD_MANAGAE_POPUP_CREATE_CHANNEL_LABEL');
      } else if (props.operationType === 'Edit') {
        return t('PRELOAD_MANAGAE_POPUP_EDIT_CHANNEL_LABEL');
      } else {
        return t('RELOAD_MANAGAE_POPUP_DELETE_CHANNEL_LABEL');
      }
    }
  }

  const onFileClick = (event: any): void => {
    event.target.value = '';
  }

  const body = (
    <S.Container>
      <div className="model-container pop-up-style">
        <div className="modal-header">
          <h4 id="simple-modal-title">{renderElementLabels()} </h4>
          <CloseOutlinedIcon className="modal-close" aria-label="close" onClick={() => { handleClose('cancel', '') }} />
        </div>
        <div className="modal-body">
          {props.operationType === 'Delete' && <p className="text-lg">{t('VIRTUAL_PRELOAD_POPUP_ACTION_DELETE_CONFIRMATION')}</p>}
          {props.operationType !== 'Delete' && <Formik
            initialValues={{
              name: name,
              model: model,
              make: make,
              state: status,
              channelName,
              channelId,
              channelDescription,
              slotCount,
              appName
            }}
            validationSchema={yup.object().shape({
              make: (props.modalType === 'Device' && props.operationType === 'Create New') && yup.string()
                .required(t('PRELOAD_MANAGE_POPUP_MAKE_REQUIRED_ERROR'))
                .matches(
                  /^[^\s]+(\s+[^\s]+)*$/,
                  t('PRELOAD_MANAGE_POPUP_MAKE_INVALID_ERROR')
                ),
              model: (props.modalType === 'Device') && yup.string()
                .required(t('PRELOAD_MANAGE_POPUP_MODEL_REQUIRED_ERROR'))
                .matches(
                  /^[^\s]+(\s+[^\s]+)*$/,
                  t('PRELOAD_MANAGE_POPUP_MODEL_INVALID_ERROR')
                ),
              name: (props.modalType === 'Device') && yup.string()
                .required(t('PRELOAD_MANAGE_POPUP_NAME_REQUIRED_ERROR'))
                .matches(
                  /^[^\s]+(\s+[^\s]+)*$/,
                  t('PRELOAD_MANAGE_POPUP_NAME_INVALID_ERROR')
                ),
              channelName: (props.modalType === 'Channel') && yup.string()
                .required(t('PRELOAD_MANAGE_POPUP_CHANNEL_NAME_REQUIRED_ERROR'))
                .matches(
                  /^[^\s]+(\s+[^\s]+)*$/,
                  t('PRELOAD_MANAGE_POPUP_CHANNEL_NAME_INVALID_ERROR')
                ),
              channelDescription: (props.modalType === 'Channel') && yup.string()
                .required(t('PRELOAD_MANAGE_POPUP_CHANNEL_DESCRIPTION_REQUIRED_ERROR'))
                .matches(
                  /^[^\s]+(\s+[^\s]+)*$/,
                  t('PRELOAD_MANAGE_POPUP_CHANNEL_DESCRIPTION_INVALID_ERROR')
                ),
              channelId: (props.modalType === 'Channel') && yup.string()
                .required(t('PRELOAD_MANAGE_POPUP_CHANNEL_ID_REQUIRED_ERROR'))
                .matches(
                  /^[^\s]+(\s+[^\s]+)*$/,
                  t('PRELOAD_MANAGE_POPUP_CHANNEL_ID_INVALID_ERROR')
                ),
              appName: (props.modalType === 'App' && appName?.length === 0) ? yup.string()
                .required(t('PRELOAD_MANAGE_POPUP_APP_NAME_REQUIRED_ERROR'))
                .matches(
                  /^[^\s]+(\s+[^\s]+)*$/,
                  t('PRELOAD_MANAGE_POPUP_APP_NAME_INVALID_ERROR')
                ) : yup.string()
                  .matches(
                    /^[^\s]+(\s+[^\s]+)*$/,
                    t('PRELOAD_MANAGE_POPUP_APP_NAME_INVALID_ERROR'))
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              let payload;
              if (props.modalType === 'Device') {
                payload = {
                  status: status ? 'ACTIVE' : 'INACTIVE',
                  name: name,
                  make: make,
                  model: model,
                  id: props.operationType === 'Create New' ? '' : props.activeRow.id
                }
              } else if (props.modalType === 'Channel') {
                payload = {
                  status: status ? 'ACTIVE' : 'INACTIVE',
                  name: channelName,
                  channelId: channelId,
                  description: channelDescription,
                  numberOfSlots: slotCount
                }
              } else {
                payload = {
                  appIcon,
                  appName,
                  fileId,
                  fileUrl,
                  appVersionName,
                  appVersionCode,
                  packageName,
                  channels: selectedChannelList,
                  status: 'ACTIVE'
                }
              }
              modifyPayload(payload);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
              dirty,
              isValid,
              setFieldValue
            }) => (
              <form onSubmit={handleSubmit} >
                <Grid container>
                  <div className="row">

                    {props.modalType === 'Device' &&
                      <Grid item sm={12} md={6} className="form-row">
                        <TextField
                          variant="outlined"
                          aria-describedby="Make"
                          placeholder={t('PRELOAD_MANAGE_POPUP_MAKE_PLACEHOLDER')}
                          label={`${t('PRELOAD_MANAGE_POPUP_MAKE_LABEL')} *`}
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(touched.make && errors.make)}
                          helperText={touched.make && errors.make}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            setMake(e.target.value);
                          }}
                          value={make}
                          name="make"
                          type="text"
                          disabled={props.operationType === 'Edit'}
                        />
                      </Grid>
                    }
                    {props.modalType === 'Device' &&
                      <Grid item sm={12} md={6} className="form-row">
                        <TextField
                          variant="outlined"
                          aria-describedby="Model"
                          placeholder={t('PRELOAD_MANAGE_POPUP_MODEL_PLACEHOLDER')}
                          label={`${t('PRELOAD_MANAGE_POPUP_MODEL_LABEL')} *`}
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(touched.model && errors.model)}
                          helperText={touched.model && errors.model}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            setModel(e.target.value);
                          }}
                          value={model}
                          name="model"
                          type="text"
                        />
                      </Grid>
                    }
                    {props.modalType === 'Device' && <Grid item xs={12} sm={12} className="form-row">
                      <TextField
                        variant="outlined"
                        aria-describedby="Name"
                        placeholder={t('ENTER_NAME_HERE')}
                        label={`${t('NAME')} *`}
                        InputLabelProps={{ shrink: true }}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          setName(e.target.value);
                        }}
                        value={name}
                        name="name"
                        type="text"
                      />
                    </Grid>}
                    {props.modalType === 'Channel' && <Grid item sm={12} md={6} className="form-row">
                      <TextField
                        variant="outlined"
                        aria-describedby="Name"
                        placeholder={t('ENTER_NAME_HERE')}
                        label={`${t('PRELOAD_MANAGE_POPUP_CHANNEL_NAME_LABEL')} *`}
                        InputLabelProps={{ shrink: true }}
                        error={Boolean(touched.channelName && errors.channelName)}
                        helperText={touched.channelName && errors.channelName}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          setChannelName(e.target.value);
                        }}
                        value={channelName}
                        name="channelName"
                        type="text"
                      />
                    </Grid>}
                    {props.modalType === 'Channel' && <Grid item sm={12} md={6} className="form-row">
                      <TextField
                        variant="outlined"
                        aria-describedby="Name"
                        placeholder={t('PRELOAD_MANAGE_POPUP_CHANNEL_ID_PLACEHOLDER')}
                        label={`${t('PRELOAD_MANAGE_POPUP_CHANNEL_ID_LABEL')} *`}
                        InputLabelProps={{ shrink: true }}
                        error={Boolean(touched.channelId && errors.channelId)}
                        helperText={touched.channelId && errors.channelId}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          setChannelId(e.target.value);
                        }}
                        value={channelId}
                        name="channelId"
                        type="text"
                        disabled={props.operationType === 'Edit'}
                      />
                    </Grid>}
                    {props.modalType === 'Channel' && <Grid item xs={12} sm={12} className="form-row">
                      <TextField
                        variant="outlined"
                        aria-describedby="Name"
                        placeholder={t('PRELOAD_MANAGE_POPUP_CHANNEL_DESCRIPTION_PLACEHOLDER')}
                        label={`${t('PRELOAD_MANAGE_POPUP_CHANNEL_DESCRIPTION_LABEL')} *`}
                        InputLabelProps={{ shrink: true }}
                        error={Boolean(touched.channelDescription && errors.channelDescription)}
                        helperText={touched.channelDescription && errors.channelDescription}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          setChannelDescription(e.target.value);
                        }}
                        value={channelDescription}
                        name="channelDescription"
                        type="text"
                      />
                    </Grid>}
                    {props.modalType === 'Channel' && <Grid item sm={12} md={6} className="form-row">
                      <div className="switch-wrapper">
                        <p>{t('PRELOAD_MANAGE_POPUP_CHANNEL_SLOT_COUNT_LABEL')}</p>
                        <Grid className="switch-label-wrap count-wrapper" component="label" container alignItems="center" spacing={1}>
                          <Grid
                            item className="switch-label count-btn"
                          >
                            <img
                              src="/img/subtract-icon.svg"
                              alt="icon subtract"
                              onClick={() => {
                                const value = slotCount <= 1 ? 1 : slotCount - 1;
                                setSlotCount(value);
                              }}
                            />
                          </Grid>
                          <Grid item className="count-btn">
                            <div className="switchery">
                              {slotCount}
                            </div>
                          </Grid>
                          <Grid
                            item className="switch-label count-btn"
                          >
                            <img
                              src="/img/add-icon.svg"
                              alt="icon add"
                              onClick={() => {
                                const value = slotCount < 20 ? slotCount + 1 : 20;
                                setSlotCount(value);
                              }}
                            />
                          </Grid>

                        </Grid>
                      </div>
                    </Grid>}
                    {props.modalType === 'Channel' && <Grid item sm={12} md={6} >
                      <div className="switch-wrapper">
                        <p>{t('STATUS')}</p>
                        <Grid className="switch-label-wrap" component="label" container alignItems="center" spacing={1}>
                          <Grid
                            item className="switch-label"
                          > {t('SWITCH_INACTIVE')}
                          </Grid>
                          <Grid item>
                            <div className="switchery">
                              <FormControlLabel
                                control={<Switch
                                  checked={status}
                                  onChange={(e) => handleChangeStatus(e)}
                                />}
                                label={""}
                              />
                            </div>
                          </Grid>
                          <Grid
                            item className="switch-label"
                          > {t('SWITCH_ACTIVE')}
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>}
                    {props.modalType === 'Device' && <Grid item xs={12} sm={12} >
                      <div className="switch-wrapper">
                        <p>{t('STATUS')}</p>
                        <Grid className="switch-label-wrap" component="label" container alignItems="center" spacing={1}>
                          <Grid
                            item className="switch-label"
                          > {t('SWITCH_INACTIVE')}
                          </Grid>
                          <Grid item>
                            <div className="switchery">
                              <FormControlLabel
                                control={<Switch
                                  checked={status}
                                  onChange={(e) => handleChangeStatus(e)}
                                />}
                                label={""}
                              />
                            </div>
                          </Grid>
                          <Grid
                            item className="switch-label"
                          > {t('SWITCH_ACTIVE')}
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>}
                    {(props.modalType === 'App' && props.operationType === 'Create New') &&
                      <Grid item xs={12} sm={12} className="form-row">
                        <div className="file-input-field create-app">
                          <p className="label">{`${t('PRELOAD_MANAGE_POPUP_APP_APK_LABEL')} *`}</p>
                          <input
                            type="file"
                            name="file"
                            placeholder={t('PRELOAD_MANAGE_POPUP_APP_APK_LABEL')}
                            onChange={(e) => handleFileUpload(e)}
                            accept=".apk"
                            style={{ cursor: "pointer" }}
                            onClick={onFileClick}
                          />
                          <span>
                            {t('UPLOAD_FILES')} <Publish />
                          </span>
                          <p className="file-name">
                            <FileCopy /> {files.length > 0 ? files : "No files"}
                          </p>
                          <Grid item xs={12} sm={12} className="form-row">
                            {(uploadPercentage > 0 && uploadPercentage < 100) &&
                              <LinearBarWithValueLabel uploadPercentage={uploadPercentage} />}
                            <p className="progress-bar-apk" >{uploadPercentage > 0 && uploadPercentage < 50 && t('FILE_UPLOAD_PROGRESS_INITIAL')} {(uploadPercentage > 50 && uploadPercentage < 100) && t('FILE_UPLOAD_PROGRESS_LATER')}</p>
                          </Grid>
                          <p className="error-wrap error">{fileUploadError}</p>
                        </div>
                      </Grid>

                    }
                    {(props.modalType === 'App' && (packageName || appIcon || appVersionName || appVersionCode || fileId || fileUrl)) && <div className="apk-detail-wrap">
                      <Grid item xs={12} sm={12} className="form-row">
                        <h4 className="app-heading">{t('PRELOAD_MANAGE_POPUP_APP_APK_DETAIL_LABEL')}</h4>
                      </Grid>
                      <Grid item xs={12} sm={12} className="form-row">
                        <TextField
                          variant="outlined"
                          aria-describedby="Name"
                          placeholder={t('PRELOAD_MANAGE_POPUP_APP_NAME_PLACEHOLDER')}
                          label={`${t('PRELOAD_MANAGE_POPUP_APP_NAME_LABEL')} *`}
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(touched.appName && errors.appName)}
                          helperText={touched.appName && errors.appName}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            setAppName(e.target.value);
                          }}
                          value={appName}
                          name="appName"
                          type="text"
                        />
                      </Grid>
                      <ul className="app-data-list">
                        <li>
                          {t('PRELOAD_MANAGE_POPUP_APP_ICON_LABEL')} :  <p> <img src={appIcon} alt="App_Icon" /></p>
                        </li>
                        <li>
                          {t('PRELOAD_MANAGE_POPUP_APP_PACKAGE_LABEL')} :  <p> {packageName}</p>
                        </li>
                        <li>
                          {t('PRELOAD_MANAGE_POPUP_APP_VERSION_NAME_LABEL')} : <p> {appVersionName}</p>
                        </li>
                        <li>
                          {t('PRELOAD_MANAGE_POPUP_APP_VERSION_CODE_LABEL')} : <p> {appVersionCode}</p>
                        </li>
                        <li>
                          {t('PRELOAD_MANAGE_POPUP_APP_VERSION_NAME_LABEL')} : <p> {appVersionName}</p>
                        </li>
                      </ul>

                      {/* <Grid item xs={12} sm={12} className="form-row channel-association">
                        <p>{t('PRELOAD_MANAGE_POPUP_APP_CHANNELS_ASSOCIATION_LABEL')}</p>
                        <Autocomplete
                          limitTags={2}
                          multiple
                          id="checkboxes-tags-demo"
                          options={channelList}
                          disableCloseOnSelect
                          value={defaultChipValue}
                          getOptionLabel={(option) => option.name}
                          onChange={(e, newValue) => {
                            handleChange(e);
                            const modifiledChannelList = [];
                            newValue.forEach(channel => {
                              modifiledChannelList.push(channel.id);
                            })
                            setDefaultChipValue(newValue);
                            setSelectedChannelList(modifiledChannelList);
                          }}

                          renderOption={(option, { selected }) => (
                            <React.Fragment>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                color="primary"
                                checked={selectedChannelList?.includes(option.id)}
                              />
                              {option.name}
                            </React.Fragment>
                          )}
                          renderTags={(tagValue, getTagProps) =>
                            defaultChipValue.map((option, index) => (
                              <Chip
                                label={option.name}
                                {...getTagProps({ index })}
                              // disabled={fixedOptions.indexOf(option) !== -1}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField {...params} variant="outlined"
                              placeholder={t('PRELOAD_MANAGE_POPUP_APP_CHANNELS_ASSOCIATION_PLACEHOLDER')} />
                          )}
                        />
                      </Grid> */}
                    </div>}
                  </div>
                </Grid>

                <div className="modal-footer footer-margin">
                  <Button variant="outlined" className="button-xs" color="primary" type="button" onClick={(e) => handleClose('cancel', '')}> {t('CANCEL_BUTTON')} </Button>
                  {showLoader && <Button className="button-xs" variant="contained" color="primary" type="submit" disabled
                  // startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                  >{renderElementLabels()}<Spinner color={"blue"} /></Button>}
                  {!showLoader && <Button className="button-xs" variant="contained" color="primary" type="submit" disabled={!isValid || (props.modalType === 'App' && (!packageName || !appIcon || !appVersionName || !appVersionCode || !fileId || !fileUrl || fileUploadError?.length !== 0))}
                  // startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                  >{renderElementLabels()}</Button>}
                </div>
                <p className="error">{apiError}</p>
              </form>
            )}
          </Formik>}
          {props.operationType === 'Delete' && <div className="modal-footer footer-margin">
            <Button variant="outlined" className="button-xs" color="primary" type="button" onClick={(e) => handleClose('cancel', '')}> {t('CANCEL_BUTTON')} </Button>
            {showLoader && <Button className="button-xs" variant="contained" color="primary" type="submit" disabled
            // startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
            >{renderElementLabels()}<Spinner color={"blue"} /></Button>}
            {!showLoader && <Button className="button-xs" variant="contained" color="primary" type="submit"
              // startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
              onClick={(e) => deletePreloadData()}
            >{renderElementLabels()}</Button>}
          </div>}
          {props.operationType === 'Delete' && <p className="error">{apiError}</p>}
        </div>
      </div>
    </S.Container>
  );

  return (
    // <div>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      disableEscapeKeyDown
      className={classes.modal}
      disableBackdropClick
      disableEnforceFocus
      disablePortal
    >
      {body}
    </Modal>
    // </div>
  );
}

export default VirtualPreloadPopup;