import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import {
  Button,
  FormControl,
  TextField,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Footer from "../../components/Layout/Footer/FooterView";
import { useAuth } from "../../hooks/auth";
import * as S from "./ResetPasswordPage.styles";
import { useTranslation } from "react-i18next";
import { API_URL, checkPassword } from "@dr-one/utils";

function ResetPasswordPage() {
  const history = useHistory();
  const { search } = useLocation();

  const { message } = useAuth();
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [recoveryPasswordStatus, toggleResetPasswordStatus] = useState("");
  const [errorFields, setErrorFields] = useState({
    password: false,
    comfirm_password: false,
  });
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordIsEqual, setPasswordIsEqual] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    if (!!search) {
      setToken(search.split("token=")[1] || "");
    } else {
      history.replace("/login");
    }
  }, [search]);

  function handleErrorFields(e: any) {
    setErrorFields((prev) => ({ ...prev, [e.target.id]: !e.target.value }));
    if (e.target.id === "password" && !!e.target.value) {
      setPasswordValid(!checkPassword(e.target.value));
    }
    if (e.target.id === "comfirm_password" && !!e.target.value) {
      setPasswordIsEqual(e.target.value !== password);
    }
  }
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(API_URL + "/auth/reset_password/", { password, token })
      .then(() => {
        toggleResetPasswordStatus(t("PASSWORD_RESET"));
        history.push("/login");
      })
      .catch(({ response }) => {
        if (response?.status === 400 && response?.data?.non_field_errors) {
          toggleResetPasswordStatus(
            `${response.data.non_field_errors.toString()}`
          );
        }
        toggleResetPasswordStatus(t("PASSWORD_RESET_ERROR"));
      });
  };

  const handleNotificationClose = () => {
    toggleResetPasswordStatus("");
  };
  return (
    <React.Fragment>
      <S.Container className="signup-wrapper">
        <div className="center-box">
          <div onSubmit={handleResetPassword} className="align-center">
            <img className="logo" src={"/img/dr-logo.svg"} alt="Logo" />
            <div className="white-box align-left">
              <h3>{t("RESET_PASSWORD")}</h3>
              <h6>{t("PASSWORD_INSTRUCTION")}</h6>
              <FormControl>
                <section className="form-row">
                  <TextField
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    onBlur={handleErrorFields}
                    id="password"
                    type="password"
                    variant="outlined"
                    aria-describedby="desc-user-password"
                    placeholder={t("PASSWORD_PLACEHOLDER")}
                  />
                  {!!errorFields.password && (
                    <p className="error">{t("FIELD_PASSWORD")}</p>
                  )}
                  {!!passwordValid && (
                    <p className="error">{t("PASSWORD_WEAK")}</p>
                  )}
                </section>
                <section className="form-row">
                  <TextField
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    onBlur={handleErrorFields}
                    type="password"
                    variant="outlined"
                    id="comfirm_password"
                    aria-describedby="desc-user-confirm-password"
                    placeholder={t("CONFIRM_PASSWORD")}
                  />
                  {!!errorFields.comfirm_password && (
                    <p className="error">{t("FIELD_COMFIRM_PASSWORD")}</p>
                  )}
                  {!!passwordIsEqual && (
                    <p className="error">
                      {t("FIELD_COMFIRM_PASSWORD_NOT_MATCH")}
                    </p>
                  )}
                </section>
                <Button
                  onClick={handleResetPassword}
                  variant="contained"
                  disabled={
                    Object.values(errorFields).some((e) => !!e) ||
                    passwordIsEqual ||
                    passwordValid
                  }
                  color="primary"
                  type="submit"
                >
                  {message === "LOAD" ? t("BUTON_LOAD") : t("RESET_PASSWORD")}
                </Button>
              </FormControl>
            </div>
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

export default ResetPasswordPage;
