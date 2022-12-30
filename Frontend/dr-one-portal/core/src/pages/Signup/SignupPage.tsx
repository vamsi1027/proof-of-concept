import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  Button,
  IconButton,
  FormControl,
  TextField,
  Checkbox,
  Snackbar,
} from "@material-ui/core";
import axios from "axios";
import Footer from "../../components/Layout/Footer/FooterView";
import { useAuth } from "../../hooks/auth";
import * as S from "./SignupPage.styles";
import { Link } from "react-router-dom";
import VisibilityTwoToneIcon from "@material-ui/icons/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@material-ui/icons/VisibilityOffTwoTone";
import CloseIcon from "@material-ui/icons/Close";
import { API_URL, checkPassword } from "@dr-one/utils";
import { useTranslation } from "react-i18next";
import isEmail from "../../hooks/utils/isEmail";
const nameRegex =
  /(\d+|!|@|#|\$|\%|&|\*|\(|\)|\+|\/|\_|\;|\:|\ª|\°|\º|\{|\}|\[|\]|\£|\¢|\¬|\\|\§|\<|\>|\^|\?|\,|\-|\=|\.|\`|\´|\~)/gi;

function SignupPage() {
  const history = useHistory();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } };
  const { user, signin, signinMFA, message } = useAuth();
  const [errorFields, setErrorFields] = useState({
    first_name: false,
    last_name: false,
    email: false,
    company: false,
    phone: false,
    password: false,
    comfirm_password: false,
  });
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordIsEqual, setPasswordIsEqual] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState("");
  const [isShowPasswordVisibilityIcon, togglePasswordVisibilityIcon] =
    useState(false);
  const [
    isShowConfirmPasswordVisibilityIcon,
    togglePasswordConfirmVisibilityIcon,
  ] = useState(false);
  const [termsApproved, setTermsApproved] = useState(false);
  const { t } = useTranslation();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const fieldValid = requirementFields();
    if (fieldValid && checkPassword(password) && isEmail(email)) {
      handleRegister();
    } else {
      setNotification(t("FIELD_REQUIRED"));
    }
    if (message !== "LOAD") {
      const redirect = () => {
        history.replace(from);
      };
    }
  };
  const handleNotificationClose = () => {
    setNotification("");
  };
  const togglePasswordIcon = () => {
    togglePasswordVisibilityIcon(
      (isShowPasswordVisibilityIcon) => !isShowPasswordVisibilityIcon
    );
  };
  const requirementFields = (): boolean => {
    return (
      !!first_name &&
      !!last_name &&
      !!email &&
      !!company &&
      !!phone &&
      !!password &&
      !!confirmPassword &&
      !!termsApproved
    );
  };
  const toggleConfirmTerms = () => {
    setTermsApproved((prevTermsApproved) => !prevTermsApproved);
  };
  const toggleConfirmPasswordIcon = () => {
    togglePasswordConfirmVisibilityIcon(
      (isShowConfirmPasswordVisibilityIcon) =>
        !isShowConfirmPasswordVisibilityIcon
    );
  };
  function handleRegister() {
    const registerData = {
      first_name,
      last_name,
      email,
      company,
      phone,
      password,
    };
    axios
      .post(API_URL + "/api/users/register/", registerData)
      .then(() => {
        setNotification(t("USER_REGISTERED"));
        history.push("/login");
      })
      .catch(({ response }) => {
        if (response?.status === 400 && response?.data?.non_field_errors) {
          setNotification(`${response.data.non_field_errors.toString()}`);
        }
        setNotification(t("REGISTER_ERROR"));
      });
  }
  function handleErrorFields(e: any) {
    setErrorFields((prev) => ({ ...prev, [e.target.id]: !e.target.value }));
    if (e.target.id === "password" && !!e.target.value) {
      setPasswordValid(!checkPassword(e.target.value));
    }
    if (e.target.id === "comfirm_password" && !!e.target.value) {
      setPasswordIsEqual(e.target.value !== password);
    }
    if (e.target.id === "email" && !!e.target.value) {
      setEmailValid(!isEmail(e.target.value));
    }
  }
  const passwordErrorViewIcon = `error-view-${
    errorFields.password || passwordValid
  }`;
  const confirmPasswordErrorViewIcon = `error-view-${
    !!errorFields.comfirm_password || passwordIsEqual
  }`;
  return (
    <React.Fragment>
      <S.Container className="signup-wrapper">
        <div className="center-box">
          <div onSubmit={handleSignup} className="align-center">
            <img className="logo" src={"/img/dr-logo.svg"} alt="Logo" />

            <div className="white-box align-left">
              <h3>{t("REGISTER")}</h3>
              <h6> {t("FORM_INSTRUCTION")}</h6>
              <FormControl className="form-control">
                <section className="form-row half-name-fields">
                  <div>
                    <TextField
                      onChange={(e) => {
                        if (!!errorFields.first_name) {
                          setErrorFields((prev) => ({
                            ...prev,
                            first_name: false,
                          }));
                        }
                        if (e.target.value.length <= 50) {
                          setFirstName(e.target.value.replace(nameRegex, ""));
                        }
                      }}
                      onBlur={handleErrorFields}
                      className={
                        !!errorFields.first_name ? "required-field" : ""
                      }
                      value={first_name}
                      type="text"
                      id="first_name"
                      variant="outlined"
                      aria-describedby="desc-first-name"
                      placeholder={t("FIRST_NAME")}
                    />
                    {!!errorFields.first_name && (
                      <p className="error">{t("FIELD_FIRST_NAME")}</p>
                    )}
                  </div>
                  <div>
                    <TextField
                      onChange={(e) => {
                        if (!!errorFields.last_name) {
                          setErrorFields((prev) => ({
                            ...prev,
                            last_name: false,
                          }));
                        }
                        if (e.target.value.length <= 100) {
                          setLastName(e.target.value.replace(nameRegex, ""));
                        }
                      }}
                      onBlur={handleErrorFields}
                      className={
                        !!errorFields.last_name ? "required-field" : ""
                      }
                      value={last_name}
                      type="text"
                      id="last_name"
                      variant="outlined"
                      aria-describedby="desc-last-name"
                      placeholder={t("LAST_NAME")}
                    />
                    {!!errorFields.last_name && (
                      <p className="error">{t("FIELD_LAST_NAME")}</p>
                    )}
                  </div>
                </section>
                <section className="form-row">
                  <TextField
                    onChange={(e) => {
                      if (!!errorFields.company) {
                        setErrorFields((prev) => ({ ...prev, company: false }));
                      }
                      if (e.target.value.length <= 50) {
                        setCompany(e.target.value);
                      }
                    }}
                    onBlur={handleErrorFields}
                    className={!!errorFields.company ? "required-field" : ""}
                    value={company}
                    type="text"
                    id="company"
                    variant="outlined"
                    aria-describedby="desc-company"
                    placeholder={t("COMPANY")}
                  />
                  {!!errorFields.company && (
                    <p className="error">{t("FIELD_COMPANY")}</p>
                  )}
                </section>
                <section className="form-row">
                  <TextField
                    onChange={(e) => {
                      if (!!errorFields.phone) {
                        setErrorFields((prev) => ({ ...prev, phone: false }));
                      }
                      if (e.target.value.length <= 20) {
                        setPhone(
                          e.target.value.replace(/([A-Z]|\.|\*|\/)/gi, "")
                        );
                      }
                    }}
                    onBlur={handleErrorFields}
                    className={!!errorFields.phone ? "required-field" : ""}
                    value={phone}
                    type="text"
                    id="phone"
                    variant="outlined"
                    aria-describedby="desc-phone"
                    placeholder={t("PHONE_NUMBER")}
                  />
                  {!!errorFields.phone && (
                    <p className="error">{t("FIELD_PHONE")}</p>
                  )}
                </section>
                <section className="form-row">
                  <TextField
                    onChange={(e) => {
                      if (!!errorFields.email) {
                        setErrorFields((prev) => ({ ...prev, email: false }));
                      }
                      setEmail(e.target.value);
                    }}
                    onBlur={handleErrorFields}
                    className={!!errorFields.email ? "required-field" : ""}
                    value={email}
                    type="email"
                    id="email"
                    variant="outlined"
                    aria-describedby="desc-email"
                    placeholder={t("EMAIL")}
                  />
                  {!!errorFields.email && (
                    <p className="error">{t("FIELD_EMAIL")}</p>
                  )}
                  {!!emailValid && (
                    <p className="error">{t("FIELD_EMAIL_INVALID")}</p>
                  )}
                </section>
                <section className="form-row">
                  <TextField
                    onChange={(e) => {
                      if (!!errorFields.password) {
                        setErrorFields((prev) => ({
                          ...prev,
                          password: false,
                        }));
                      }
                      setPassword(e.target.value);
                    }}
                    onBlur={handleErrorFields}
                    className={!!errorFields.password ? "required-field" : ""}
                    value={password}
                    type={!isShowPasswordVisibilityIcon ? "password" : "text"}
                    id="password"
                    variant="outlined"
                    aria-describedby="desc-user-password"
                    placeholder={t("PASSWORD")}
                  />
                  <div
                    className={`${
                      isShowPasswordVisibilityIcon
                        ? "view-password-icon view_icon"
                        : "view-password-icon"
                    } ${passwordErrorViewIcon}`}
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
                  {!!errorFields.password && (
                    <p className="error">{t("FIELD_PASSWORD")}</p>
                  )}
                  {!!passwordValid && (
                    <p className="error">{t("PASSWORD_WEAK")}</p>
                  )}
                </section>
                <section className="form-row">
                  <TextField
                    onChange={(e) => {
                      if (!!errorFields.comfirm_password) {
                        setErrorFields((prev) => ({
                          ...prev,
                          comfirm_password: false,
                        }));
                      }
                      setConfirmPassword(e.target.value);
                    }}
                    onBlur={handleErrorFields}
                    className={
                      !!errorFields.comfirm_password ? "required-field" : ""
                    }
                    value={confirmPassword}
                    type={
                      !isShowConfirmPasswordVisibilityIcon ? "password" : "text"
                    }
                    id="comfirm_password"
                    variant="outlined"
                    aria-describedby="desc-user-confirm-password"
                    placeholder={t("PASSWORD_CONFIRM")}
                  />
                  <div
                    className={`${
                      isShowConfirmPasswordVisibilityIcon
                        ? "view-password-icon view_icon"
                        : "view-password-icon"
                    } ${confirmPasswordErrorViewIcon}`}
                  >
                    <VisibilityTwoToneIcon
                      className="view-eye"
                      onClick={toggleConfirmPasswordIcon}
                    />
                    <VisibilityOffTwoToneIcon
                      className="close-eye"
                      onClick={toggleConfirmPasswordIcon}
                    />
                  </div>
                  {!!errorFields.comfirm_password && (
                    <p className="error">{t("FIELD_COMFIRM_PASSWORD")}</p>
                  )}
                  {!!passwordIsEqual && (
                    <p className="error">
                      {t("FIELD_COMFIRM_PASSWORD_NOT_MATCH")}
                    </p>
                  )}
                </section>
                <section className="form-row">
                  <Checkbox
                    color="primary"
                    value="checkedA"
                    inputProps={{ "aria-label": "Checkbox A" }}
                    onChange={toggleConfirmTerms}
                    checked={termsApproved}
                  />{" "}
                  <span>
                    {t("TERMS_CONDITIONS_ACCEPT_USER")}{" "}
                    <a
                      href="https://digitalreef.com/terms-conditions/"
                      target="_blank"
                    >
                      {t("TERMS_CONDITIONS")}
                    </a>
                  </span>
                </section>
                <Button
                  disabled={
                    !requirementFields() ||
                    Object.values(errorFields).some((e) => !!e) ||
                    passwordIsEqual ||
                    passwordValid ||
                    emailValid
                  }
                  onClick={handleSignup}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  {message === "LOAD" ? t("BUTON_LOAD") : t("REGISTER")}
                </Button>
              </FormControl>
              <div className="login-actions">
                <p>
                  {t("NEED_TO")}{" "}
                  <span>
                    <Link to="/login">{t("LOGIN")}</Link>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </S.Container>
      <Footer />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        message={notification}
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

export default SignupPage;
