import { Snackbar } from "@material-ui/core";
import { Alert, Color } from "@material-ui/lab";
import React from "react";

export type SnackBarMessageProps = {
  open: boolean;
  message: string;
  severityType?: Color;
  onClose?: (open: any) => void;
};

const SnackBarMessage = (props: SnackBarMessageProps) => {
  return (
    <div>
      <Snackbar
        autoHideDuration={10000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={props.open}
        onClose={props.onClose}
      >
        <Alert
          onClose={props.onClose}
          severity={props.severityType}
        >
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
SnackBarMessage.defaultProps = {
  open: "",
  message: "",
  severityType: "success",
  onClose: console.log,
};

export default SnackBarMessage;
