import React, { useState } from "react";
import * as S from "./AdminPopup.styles";
import { apiDashboard, helper } from "@dr-one/utils";
import { Spinner } from "@dr-one/shared-component";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {
  TextField,
  Button,
  Modal,
  makeStyles,
  Switch,
  FormControlLabel,
  Grid
} from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as yup from 'yup';

function AdminPopup(props) {
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
  const [status, setStatus] = useState(props.operationType === 'Add new' ? true : props.rowData.active);
  const [name, setName] = useState(props.operationType === 'Add new' ? '' : props.rowData.name);
  const [description, setDescription] = useState(props.operationType === 'Add new' ? '' : props.rowData.description);
  const [apiError, setApiError] = useState('');

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

  const handleClose = (type: string): void => {
    setOpen(false);
    props.handleOpen(false, type, false);
  };

  const handleChangeStatus = (e: any): void => {
    setStatus(e.target.checked);
  }

  const modifyPayload = (payload: any): void => {
    toggleLoader(true);
    if (props.operationType === 'Add new') {
      apiDashboard.post(props.type === 'Category' ? 'campaign-mgmt-api/configurations/campaigncategories' : `campaign-mgmt-api/${props.type.toLowerCase()}`, payload)
        .then(response => {
          setName('');
          setDescription('');
          setApiError('');
          handleClose('success');
          toggleLoader(false);
        }, error => {
          setApiError(helper.getErrorMessage(error));
          toggleLoader(false);
        });
    } else {
      apiDashboard.put(props.type === 'Category' ? `campaign-mgmt-api/configurations/campaigncategories/${props.rowData.id}` : `campaign-mgmt-api/${props.type.toLowerCase()}/${props.rowData.id}`, payload)
        .then(response => {
          setName('');
          setDescription('');
          setApiError('');
          handleClose('success');
          toggleLoader(false);
        }, error => {
          setApiError(helper.getErrorMessage(error));
          toggleLoader(false);
        });
    }
  }

  const renderElementLabels = (): string => {
    if (props.type === 'Advertiser') {
      if (props.operationType === 'Add new') {
        return t('ADMIN_MANAGAE_POPUP_CREATE_ADVERTISER_LABEL');
      } else {
        return t('ADMIN_MANAGAE_POPUP_EDIT_ADVERTISER_LABEL');
      }
    } else if (props.type === 'Agency') {
      if (props.operationType === 'Add new') {
        return t('ADMIN_MANAGAE_POPUP_CREATE_AGENCY_LABEL');
      } else {
        return t('ADMIN_MANAGAE_POPUP_EDIT_AGENCY_LABEL');
      }
    } else if (props.type === 'Category') {
      if (props.operationType === 'Add new') {
        return t('ADMIN_MANAGAE_POPUP_CREATE_CATEGORY_LABEL');
      } else {
        return t('ADMIN_MANAGAE_POPUP_EDIT_CATEGORY_LABEL');
      }
    }
  }

  const body = (
    <S.Container>
      <div className="model-container pop-up-style">
        <div className="modal-header">
          <h4 id="simple-modal-title">{renderElementLabels()} </h4>
          <CloseOutlinedIcon className="modal-close" aria-label="close" onClick={() => { handleClose('') }} />
        </div>
        <div className="modal-body">
          <Formik
            initialValues={{
              name: name,
              description: description,
              state: status
            }}
            validationSchema={yup.object().shape({
              name: yup.string()
                .required(t('ADMIN_POPUP_NAME_REQUIRED_ERROR'))
                .matches(
                  /^[^\s]+(\s+[^\s]+)*$/,
                  t('ADMIN_POPUP_NAME_INVALID_ERROR')
                ),
              description: props.type !== 'Category' && yup.string()
                .required(t('ADMIN_POPUP_DESCRIPTION_REQUIRED_ERROR'))
                .matches(
                  /^[^\s]+(\s+[^\s]+)*$/,
                  t('ADMIN_POPUP_DESCRIPTION_INVALID_ERROR')
                )
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              const payload = {
                active: status,
                name: name,
                description: description,
                createdDate: props.operationType === 'Add new' ? null : props.rowData.createdDate,
                updatedAt: props.operationType === 'Add new' ? null : props.rowData.updatedAt
              }
              if (props.type === 'Category') {
                delete payload['description'];
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
              <form onSubmit={handleSubmit} className="cc-form-wrapper">
                <Grid container>
                  <div className="row">
                    <Grid item xs={12} sm={12} className="form-row">
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
                    </Grid>
                    {props.type !== 'Category' &&
                      <Grid item xs={12} sm={12} className="form-row">
                        <TextField
                          variant="outlined"
                          aria-describedby="Description"
                          placeholder={t('ENTER_DESCRIPTION_HERE')}
                          label={`${t('DESCREPTION')} *`}
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(touched.description && errors.description)}
                          helperText={touched.description && errors.description}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            setDescription(e.target.value);
                          }}
                          value={description}
                          name="description"
                          type="textarea"
                        />
                      </Grid>
                    }

                    <Grid item xs={12} sm={12} >
                      <div className="switch-wrapper">
                        <p>{props.type} {t('STATE')}</p>
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
                    </Grid>
                  </div>
                </Grid>

                <div className="modal-footer">
                  <Button variant="outlined" className="button-xs" color="primary" type="button" onClick={(e) => handleClose('')}> {t('CANCEL_BUTTON')} </Button>
                  {showLoader && <Button className="button-xs" variant="contained" color="primary" type="submit" disabled={!isValid}
                  // startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                  >{props.operationType === "Edit" ? renderElementLabels() : props.type === 'Advertiser' ? t('ADMIN_MANAGE_POPUP_ADD_ADVERTISER_BUTTON_LABEL') : props.type === 'Agency' ? t('ADMIN_MANAGE_POPUP_ADD_AGENCY_BUTTON_LABEL') : t('ADMIN_MANAGE_POPUP_ADD_CATEGORY_BUTTON_LABEL')}<Spinner color={"blue"} /></Button>}
                  {!showLoader && <Button className="button-xs" variant="contained" color="primary" type="submit" disabled={!isValid}
                  // startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                  >{props.operationType === "Edit" ? renderElementLabels() : props.type === 'Advertiser' ? t('ADMIN_MANAGE_POPUP_ADD_ADVERTISER_BUTTON_LABEL') : props.type === 'Agency' ? t('ADMIN_MANAGE_POPUP_ADD_AGENCY_BUTTON_LABEL') : t('ADMIN_MANAGE_POPUP_ADD_CATEGORY_BUTTON_LABEL')}</Button>}
                </div>
                <p className="error">{apiError}</p>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </S.Container>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableEscapeKeyDown
        className={classes.modal}
        disableBackdropClick
      >
        {body}
      </Modal>
    </div>
  );
}

export default AdminPopup;