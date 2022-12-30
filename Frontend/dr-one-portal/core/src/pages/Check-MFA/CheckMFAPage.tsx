import React, { useState, useEffect } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";

import { Button, FormControl, TextField } from "@material-ui/core";
import Footer from "../../components/Layout/Footer/FooterView";
import { useAuth } from "../../hooks/auth";
import * as S from "./CheckMFAPage.styles";
import { useTranslation } from "react-i18next";

function CheckMFAPage() {
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const { user, signinMFA, message, handleClearMessage } = useAuth();
  const [mfa, setMFA] = useState("");
  const [mfaURI, setMFAURI] = useState("");
  const [MFAErrorMessage, setMFAErrorMessage] = useState("");
  const { t } = useTranslation();
  const hangleCheckMFA = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfa.length < 6) {
      setMFAErrorMessage("MFA_NOT_VALID");
      handleClearMessage()
    } else if (message !== "LOAD") {
      const redirect = (pathname?: { pathname?: string }) => {
        if (from?.pathname.includes("check-mfa")) {
          history.replace({ pathname: "/" });
        } else {
          pathname.pathname = !pathname.pathname ? "/" : pathname.pathname;
          history.replace(pathname || from);
        }
      };
      setMFAErrorMessage("");
      signinMFA({ email: user.email, mfa_key: mfa }, redirect);
    }
  };
  useEffect(() => {
    if (!!user && !!user.qr_code) {
      setMFAURI(encodeURIComponent(user.qr_code));
    }
  }, [user]);

  return (
    <React.Fragment>
      <S.Container className="qr-check-wrapper">
        <div className="center-box">
          <div onSubmit={hangleCheckMFA} className="align-center">
            <img className="logo" src={"/img/dr-logo.svg"} alt="Logo" />
            <div className="recover-password-wrapper">
              <div className="white-box align-left">
                <h3>{t("QR_CODE_AUTEHNTICATION")}</h3>
                <ol className="qr-instruction">
                  <li>{t("QR_CODE_INSTRUCTION_0")}</li>
                  <li>{t("QR_CODE_INSTRUCTION_1")}</li>
                  <li>{t("QR_CODE_INSTRUCTION_2")}</li>
                  <li>{t("QR_CODE_INSTRUCTION_3")}</li>
                </ol>
                <FormControl>
                  {/* PUT THE QR-CODE LINK HERE */}
                  {!!mfaURI && (
                    <img
                      className="qr-img"
                      src={`https://chart.googleapis.com/chart?chs=200x200&chld=M%7C0&cht=qr&chl=${mfaURI}`}
                    />
                  )}
                  <form className="form-row" onSubmit={hangleCheckMFA}>
                    <TextField
                      onChange={(e) => {
                        if (e.target.value.length < 7)
                          setMFA(e.target.value.replace(/\D/gi, ""));
                      }}
                      value={mfa}
                      type="text"
                      variant="outlined"
                      aria-describedby="desc-check-mfa"
                      placeholder={t("AUTHENTICATION_CODE")}
                    />
                  </form>
                  <Button
                    onClick={hangleCheckMFA}
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={mfa.length !== 6}
                  >
                    {message === "LOAD" ? t("BUTON_LOAD") : t("CONFIRM")}
                  </Button>
                  {!!message.includes("WRONG") ? (
                    <p className="error">{t(message)}</p>
                  ) : !!MFAErrorMessage ? (
                    <p className="error">{t(MFAErrorMessage)}</p>
                  ) : null}
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      </S.Container>
      <Footer />
    </React.Fragment>
  );
}

export default CheckMFAPage;
