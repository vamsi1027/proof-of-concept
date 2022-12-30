import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
// let history = createBrowserHistory();

export default function AlertDialog({
    isOpen,
    moveToNextRoute,
    onDiscardClick
}: any) {
    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={onDiscardClick}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You are moving without saving data. Are you sure about this
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDiscardClick} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={moveToNextRoute} color="primary" autoFocus>
                        Save data
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
