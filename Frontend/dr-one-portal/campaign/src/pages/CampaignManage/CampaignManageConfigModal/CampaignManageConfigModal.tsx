import React, { useState } from "react";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import AppleIcon from '@material-ui/icons/Apple';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Publish from "@material-ui/icons/Publish";
import {
  TextField,
  InputLabel,
  Button
} from "@material-ui/core";

function CampaignManageConfigModal(props) {
  const [teamId, setTeamId] = useState("");
  const [keyId, setKeyId] = useState("");
  const [token, setToken] = useState("");

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
  const [open, setOpen] = React.useState(true);

  const rand = (): number => {
    return Math.round(Math.random() * 20) - 10;
  }

  const getModalStyle = (): any => {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  const [modalStyle] = React.useState(getModalStyle);

  const handleClose = (): void => {
    setOpen(false);
    props.handleOpen(false);
  };

  const body = (
    <div className="model-container">
      <div className="modal-header">
        <h4 id="simple-modal-title">Campaign Management Configurations</h4>
        <CloseOutlinedIcon className="modal-close" onClick={handleClose} />
      </div>

      <div className="modal-body">
        <div className="">
          <p id="simple-modal-description"><AppleIcon /> <h6>APNS Configuration</h6> <HelpOutlineOutlinedIcon className="tooltip-icon" /></p>
          <p className="required mb-8">*Required Fields</p>
        </div>


        <Grid container>
            <Grid item xs={12} sm={6} className="form-row">

              <TextField
                  onChange={(e) => setTeamId(e.target.value)}
                  value={teamId}
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  aria-describedby="desc-team-id"
                  placeholder="ex: H55Q92ANPH"
                  label="Team ID*"                
              />
            </Grid>

            <Grid item xs={12} sm={6} className="form-row">
              <TextField
                  onChange={(e) => setKeyId(e.target.value)}
                  value={keyId}
                  type="text"
                  variant="outlined"
                  aria-describedby="desc-key-id"
                  placeholder="ex: 463R3CTN5X"
                  label="Key ID*"
                  InputLabelProps={{ shrink: true }}                
              />
            </Grid>

            <Grid item xs={12} sm={6}>

              <div className="file-input-field">
                <p className="label">APNs Key</p>
                <input
                   type="file"
                   aria-describedby="desc-apns-key"
                />
                <span>
                  Click to Upload <Publish />
                </span>
                <p className="file-name">
                  File Name
                </p>
              </div>
              
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                onChange={(e) => setToken(e.target.value)}
                value={token}
                type="text"
                variant="outlined"
                aria-describedby="desc-tokens"
                label="Tokens"     
                InputLabelProps={{ shrink: true }}           
                />
                <p className="required">*Optional</p>
            </Grid>

          
         
        </Grid>
      </div>

      <div className="modal-footer flex-right">
        <Button className="button-xs" variant="outlined" color="primary" type="submit" startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}>Save</Button>

      </div>

    </div>
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
      >
        {body}
      </Modal>
    </div>
  );
}

export default CampaignManageConfigModal;