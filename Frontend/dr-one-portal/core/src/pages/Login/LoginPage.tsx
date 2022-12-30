import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  Button,
  FormControl,
  IconButton,
  Snackbar,
  TextField,
} from "@material-ui/core";
import Footer from "../../components/Layout/Footer/FooterView";
import CloseIcon from "@material-ui/icons/Close";
import VisibilityTwoToneIcon from "@material-ui/icons/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@material-ui/icons/VisibilityOffTwoTone";
import { useAuth } from "../../hooks/auth";
import * as S from "./LoginPage.styles";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function LoginPage() {
  const history = useHistory();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } };
  const { user, signin, handleClearMessage, message, changeMFAToOff } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPasswordVisibilityIcon, togglePasswordVisibilityIcon] =
    useState(false);
  const [mfa, setMFA] = useState("");
  const { t } = useTranslation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (message !== "LOAD") {
      const redirect = (pathname?: { pathname?: string }) => {
        history.replace(pathname || from);
      };
      let loginData: any = { email, password };
      if (!!user && !!user.useMFA) {
        loginData.mfa = mfa;
      }
      signin(loginData, redirect, from.pathname);
    }
  };
  function fieldsIsValid(): boolean {
    if (!!user && !!user.useMFA) {
      return mfa.length !== 6;
    } else if (!!email && !!password) {
      return false;
    } else {
      return true;
    }
  }
  const togglePasswordIcon = () => {
    togglePasswordVisibilityIcon(
      (isShowPasswordVisibilityIcon) => !isShowPasswordVisibilityIcon
    );
  };

  return (
    <React.Fragment>
      <S.Container className="login-wrapper">
        <div className="left-column bg-pattern">
          <div className="content-wrapper">
            <h3>{t("WELCOME")}</h3>
            <img src={"/img/dr-logo-blue-white.svg"} alt="App Logo" />
            <h4>{t("WELCOME_TITLE")}</h4>
          </div>
        </div>
        <div className="right-column">
          <div className="content-wrapper">
            <S.Form onSubmit={handleLogin}>
              <h1>{t("LOGIN")}</h1>
              <h5>{t("FORM_INSTRUCTION")}</h5>
              <FormControl>
                <section className="form-row">
                  <TextField
                    disabled={!!user && !!user.useMFA}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    variant="outlined"
                    aria-describedby="desc-username"
                    placeholder={t("EMAIL_ADDRESS")}
                  />
                </section>
                <section className="form-row">
                  <TextField
                    disabled={!!user && !!user.useMFA}
                    className="form-input"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type={!isShowPasswordVisibilityIcon ? "password" : "text"}
                    variant="outlined"
                    aria-describedby="desc-user-password"
                    placeholder={t("PASSWORD")}
                  />
                  <div
                    className={
                      isShowPasswordVisibilityIcon
                        ? "view-password-icon view_icon"
                        : "view-password-icon"
                    }
                  >
                    <VisibilityTwoToneIcon
                      className="view-eye"
                      onClick={togglePasswordIcon}
                    />
                    <VisibilityOffTwoToneIcon
                      className="close-eye"
                      onClick={togglePasswordIcon}
                    />
                  </div>
                </section>
                {!!user && !!user.useMFA ? (
                  <section className="form-row">
                    <TextField
                      onChange={(e) => {
                        const { value } = e.target;
                        if (value.length <= 6) {
                          setMFA(value);
                        }
                      }}
                      value={mfa}
                      variant="outlined"
                      aria-describedby="desc-mfa_code"
                      placeholder={t("MFA_CODE")}
                    />
                    {!!user && !!user.useMFA ? (
                      <p
                        className="change-account"
                        onClick={() => {
                          changeMFAToOff();
                          setMFA("");
                        }}
                      >
                        <span>
                          <Link to="#">{t("CHANGE_ACCOUNT")}</Link>
                        </span>
                      </p>
                    ) : null}
                  </section>
                ) : null}
                <Button
                  onClick={handleLogin}
                  disabled={fieldsIsValid()}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  {message === "LOAD" ? t("BUTON_LOAD") : t("LOGIN")}
                </Button>
              </FormControl>
            </S.Form>
            <div className="login-actions">
              <p style={{ visibility: "hidden" }}>
                {t("NEED_TO_SIGNUP")}?{" "}
                <span>
                  <Link to="/signup">{t("REGISTER")}</Link>
                </span>
              </p>
              {!!user && !!user.useMFA ? null : (
                <p>
                  <span>
                    <Link to="/recover-password">{t("FORGOT_PASSWORD")}?</Link>
                  </span>
                </p>
              )}
            </div>
            <Footer />
          </div>
        </div>
      </S.Container>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={message.includes("ERROR")}
        autoHideDuration={6000}
        onClose={() => handleClearMessage()}
        message={t(message)}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => handleClearMessage()}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </React.Fragment>
  );
}

export default LoginPage;
