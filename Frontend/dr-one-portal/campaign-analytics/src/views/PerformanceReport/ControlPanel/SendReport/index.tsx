import {
  Button,
  Card,
  CardActions,
  CardHeader,
  IconButton,
  Modal,
} from "@material-ui/core";
import React from "react";
import { useActive } from "../../../../hooks";
import CloseIcon from "@material-ui/icons/Close";
import "./styles.css";
import Mails from "./Mails";

const SendReport: React.FunctionComponent = () => {
  const [isModalOpen, openModal, closeModal] = useActive();

  const props = {
    send: {
      className: "SendReportBtn",
      onClick: openModal,
    },

    modal: { open: isModalOpen },

    card: { className: "SendReportModalCard" },

    cardWrapper: { className: "SendReportWrapper" },

    cardHeader: {
      className: "SnedReportCardHeader",
      title: "Send report",
      titleTypographyProps: {
        style: {
          fontWeight: 600,
          fontSize: "medium",
        },
      },
    },

    cardHeaderAction: { onClick: closeModal },

    cardActions: { className: "SendReportCardActions" },

    cardActionsWrapper: { className: "SendReportCardActionsWrapper" },

    cardActionsCancel: {
      className: "SendReportCardActionsBtns",
      onClick: closeModal,
    },

    cardActionsSend: { className: "SendReportCardActionsBtns" },
  };

  return (
    <>
      <Button variant="contained" color="primary" {...props.send}>
        Send report
      </Button>

      <Modal {...props.modal}>
        <Card {...props.card}>
          <div {...props.cardWrapper}>
            <CardHeader
              {...props.cardHeader}
              action={
                <IconButton {...props.cardHeaderAction}>
                  <CloseIcon />
                </IconButton>
              }
            />

            <Mails />

            <CardActions {...props.cardActions}>
              <div {...props.cardActionsWrapper}>
                <Button variant="outlined" {...props.cardActionsCancel}>
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  {...props.cardActionsSend}
                >
                  Send
                </Button>
              </div>
            </CardActions>
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default React.memo(SendReport);
