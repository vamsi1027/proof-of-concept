import React, { useState } from "react";
import axios from "axios";

import {
  Button,
  FormControl,
  Snackbar,
  IconButton,
  TextField,
} from "@material-ui/core";
import Footer from "../../components/Layout/Footer/FooterView";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import { useAuth } from "../../hooks/auth";
import * as S from "./RecoverPasswordPage.styles";
import { Link } from "react-router-dom";
import InfoTwoToneIcon from "@material-ui/icons/InfoTwoTone";
import CloseTwoToneIcon from "@material-ui/icons/CloseTwoTone";
import isEmail from "../../hooks/utils/isEmail";
import { API_URL } from "@dr-one/utils";
import { useTranslation } from "react-i18next";

function RecoverPasswordPage() {
  const { user, signin, signinMFA, message } = useAuth();
  const [email, setEmail] = useState("");
  const [recoveryPasswordStatus, toggleRecoveryPasswordStatus] = useState("");
  const [isShowSuccesBox, toggleSuccessMessageBox] = useState(false);
  const [isShowEmailErrorMessage, toggleEmailErorMessage] = useState(true);
  const { t } = useTranslation();

  const handleNotificationClose = () => {
    toggleRecoveryPasswordStatus("");
  };
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(API_URL + "/auth/recover_password/", { email })
      .then(() => {
        toggleRecoveryPasswordStatus(t("PASSWORD_RECOVERY_REQUESTED"));
      })
      .catch(({ response }) => {
        if (response?.status === 400 && response?.data?.non_field_errors) {
          toggleRecoveryPasswordStatus(
            `${response.data.non_field_errors.toString()}`
          );
        }
        toggleRecoveryPasswordStatus(t("PASSWORD_RECOVERY_ERROR"));
      });
    toggleSuccessMessageBox(true);
  };

  const setEmailValue = (value: string) => {
    setEmail(value);
    if (!isEmail(value)) {
      toggleEmailErorMessage(true);
    } else {
      toggleEmailErorMessage(false);
    }
  };

  return (
    <React.Fragment>
      <S.Container className="signup-wrapper">
        <div className="center-box">
          <div onSubmit={handleResetPassword} className="align-center">
            <img className="logo" src={"/img/dr-logo.svg"} alt="Logo" />
            {!isShowSuccesBox && (
              <div className="recover-password-wrapper">
                <div className="white-box align-left">
                  <h3>{t("RECOVER_PASSWORD")}</h3>
                  <h6>{t("RECOVER_PASSWORD_INSTRUCTION")}</h6>
                  <FormControl>
                    <section className="form-row">
                      <TextField
                        onChange={(e) => setEmailValue(e.target.value)}
                        value={email}
                        type="email"
                        id="email"
                        variant="outlined"
                        aria-describedby="desc-email"
                        placeholder={t("EMAIL_ADDRESS")}
                      />
                      {email.length !== 0 && isShowEmailErrorMessage && (
                        <p className="error">{t("EMAIL_IS_NOT_VALID")}</p>
                      )}
                    </section>
                    <Button
                      onClick={handleResetPassword}
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isShowEmailErrorMessage}
                    >
                      {message === "LOAD"
                        ? t("BUTON_LOAD")
                        : t("RESET_PASSWORD")}
                    </Button>
                  </FormControl>
                </div>
                <div className="login-actions">
                  <p>
                    {t("RECOVER_PASSWORD_TO_SIGN_IN")}?{" "}
                    <span>
                      <Link to="/login">{t("CLICK_HERE")}</Link>
                    </span>
                  </p>
                </div>
              </div>
            )}

            {isShowSuccesBox && (
              <div className="white-box align-center position-relative action-messages">
                <div className="success badge">
                  <DoneIcon />
                </div>
                <div className="alert info">
                  <div className="alert-icon">
                    <InfoTwoToneIcon />
                  </div>
                  <div className="alert-message">
                    {t("PASSWORD_RESET_INSTRUCTIONS")}
                  </div>
                  <div className="alert-close">
                    <CloseTwoToneIcon />
                  </div>
                </div>
                <h3>{t("CHECK_EMAIL_FOR_FURTHER")}</h3>
              </div>
            )}
          </div>
        </div>
      </S.Container>
      <Footer />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={!!recoveryPasswordStatus}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        message={recoveryPasswordStatus}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleNotificationClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </React.Fragment>
  );
}

export default RecoverPasswordPage;
