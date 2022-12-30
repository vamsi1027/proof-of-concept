import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import MetisMenu from "@metismenu/react";
import "metismenujs/dist/metismenujs.css";
import TapAndPlayOutlinedIcon from "@material-ui/icons/TapAndPlayOutlined";
import SyncAltOutlinedIcon from "@material-ui/icons/SyncAltOutlined";
import AddLocationOutlinedIcon from "@material-ui/icons/AddLocationOutlined";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import ScreenLockPortraitOutlinedIcon from "@material-ui/icons/ScreenLockPortraitOutlined";
import BarChartOutlinedIcon from "@material-ui/icons/BarChartOutlined";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import GpsFixedOutlinedIcon from "@material-ui/icons/GpsFixedOutlined";
import SecurityIcon from '@material-ui/icons/Security';
import * as S from "./SidebarView.styles";
import { TrendingUp } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { userHasPermission } from "@dr-one/utils";
import { useTranslation } from "react-i18next";
import Business from "@material-ui/icons/Business";
import AdminSVGIcon from "../../Icons/AdminSVGIcon";
import OopbSVGIcon from "../../Icons/OopbSVGIcon";
import RouterPrompt from "./RouterPrompt";
function SidebarView(props) {
  const [isHover, onHover] = React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(null);
  const [activeLink, setActivelink] = React.useState(window.location.pathname)
  const [toggle, setToggle] = React.useState(false);
  const orgDetails = JSON.parse(localStorage.getItem('dr-user'));
  const orgIndex = orgDetails.organizations.findIndex(org => org.id === orgDetails?.organizationActive);
  const [showPropmpt, setPropmpt] = React.useState(JSON.parse(sessionStorage.getItem('enablePrompt')))

  let history = useHistory();
  const { t } = useTranslation();

  const addClass = (rowNumber) => {
    if (document.body.classList.contains("metismenu-navbar")) {
      onHover(true);
      setRowNumber(rowNumber);
    }
  };
  const removeClass = (): void => {
    onHover(false);
  };
  const navigateAway = (route: string): void => {
    history.push(route);
  };

  useEffect(() => {
    setToggle(true)
    // setPropmpt(JSON.parse(sessionStorage.getItem('enablePrompt')))
    const unListen = history.listen(({ pathname }) => {
      setActivelink(pathname);
      // setPropmpt(false)
    })
    sessionStorage.setItem('enablePrompt', 'false')
    return unListen;
  }, [])

  const canEnablepreloadProfile = (): boolean => {
    const userHasPermissionProfile = userHasPermission(['C_PRELOAD_PROFILE', 'C_PRELOAD_PROFILE_OWN_ORG', 'R_PRELOAD_PROFILE',
      'R_PRELOAD_PROFILE_OWN', 'R_PRELOAD_PROFILE_OWN_ORG']);
    const userHasPermissionChannel = userHasPermission(['R_PRELOAD_CHANNEL', 'R_PRELOAD_CHANNEL_OWN', 'R_PRELOAD_CHANNEL_OWN_ORG']);
    const userHasPermissionApp = userHasPermission(['R_PRELOAD_SUPPORTED_APP', 'R_PRELOAD_SUPPORTED_APP_OWN', 'R_PRELOAD_SUPPORTED_APP_OWN_ORG']);
    const userHasPermissionDevice = userHasPermission(['R_PRELOAD_SUPPORTED_DEVICE', 'R_PRELOAD_SUPPORTED_DEVICE_OWN', 'R_PRELOAD_SUPPORTED_DEVICE_OWN_ORG']);
    return userHasPermissionProfile && userHasPermissionChannel && userHasPermissionApp && userHasPermissionDevice;
  }

  const canEnablePreloadApp = (): boolean => {
    return userHasPermission(['C_PRELOAD_SUPPORTED_APP', 'C_PRELOAD_SUPPORTED_APP_OWN_ORG', 'R_PRELOAD_SUPPORTED_APP',
      'R_PRELOAD_SUPPORTED_APP_OWN', 'R_PRELOAD_SUPPORTED_APP_OWN_ORG']);
  }

  const canEnablePreloadDevice = (): boolean => {
    return userHasPermission(['C_PRELOAD_SUPPORTED_DEVICE', 'C_PRELOAD_SUPPORTED_DEVICE_OWN_ORG', 'R_PRELOAD_SUPPORTED_DEVICE',
      'R_PRELOAD_SUPPORTED_DEVICE_OWN', 'R_PRELOAD_SUPPORTED_DEVICE_OWN_ORG']);
  }

  const canEnablePreloadChannel = (): boolean => {
    return userHasPermission(['C_PRELOAD_CHANNEL', 'C_PRELOAD_CHANNEL_OWN_ORG', 'R_PRELOAD_CHANNEL', 'R_PRELOAD_CHANNEL_OWN',
      'R_PRELOAD_CHANNEL_OWN_ORG']);
  }

  const canEnableSurvey = (): boolean => {
    const userHasPermissionSurvey = userHasPermission(['R_SURVEY', 'R_SURVEY_OWN', 'R_SURVEY_OWN_ORG']);
    const userHasPermissionQuestion = userHasPermission(['R_QUESTION', 'R_QUESTION_OWN', 'R_QUESTION_OWN_ORG']);
    let enableSurvey;
    if (orgIndex > -1) {
      enableSurvey = orgDetails?.organizations[orgIndex].enableSurvey;
      if (enableSurvey) {
        return userHasPermissionSurvey && userHasPermissionQuestion;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  let intervalTime;
  function checkFormHaveUnsaved() {
    if (!intervalTime) {
      intervalTime = setInterval(() => {
        setPropmpt(JSON.parse(sessionStorage.getItem('enablePrompt')));
      }, 1000);
    }
  }
  function stopInterval() {
    clearInterval(intervalTime)
    intervalTime = null
  }
  useEffect(() => {
    if (showPropmpt) {
      stopInterval()
    }
  }, [showPropmpt])
  return (
    <S.Container className="sidebar-section">
      <RouterPrompt
        when={showPropmpt}
        onOK={() => true}
        onCancel={() => false}
      />
      <S.Logo>
        <div className="logo-wrapper">
          <img src={(orgIndex < 0 || !orgDetails?.organizations[orgIndex]?.logoFullPath) ? "/img/user.png" : orgDetails?.organizations[orgIndex]?.logoFullPath} className="org-img" alt="org pic" />
          <Link to="#">
            <img
              className="full-logo"
              src={"/img/dr-logo-white.png"}
              alt="App Logo"
            />
            <img
              className="logo-thumb"
              src={"/img/dr-logo-mob.png"}
              alt="App Logo"
            />
          </Link>
        </div>
      </S.Logo>

      <S.Navigation>
        <MetisMenu>
          {userHasPermission([
            "R_CAMPAIGN",
            "R_CAMPAIGN_OWN_ORG",
            "R_CAMPAIGN_OWN",
          ]) && (
              <li onMouseEnter={() => addClass(1)} onMouseLeave={removeClass} className={`${activeLink === '/campaign/manage' ? "nav-links active" : activeLink === '/campaign/aggregate' ? "nav-links active" : "nav-links"}`}>
                <div className={`${activeLink === '/campaign/manage' ? "nav-links active" : activeLink === '/campaign/aggregate' ? "nav-links active" : "nav-links"}`}>
                  <TapAndPlayOutlinedIcon />
                  <NavLink to="#" className={`${(activeLink === '/campaign/manage' && toggle) ? "has-arrow" : (activeLink === '/campaign/aggregate' && toggle) ? "has-arrow" : "has-arrow mm-collapsed"}`}>
                    {t("CAMPAIGNS")}
                  </NavLink>
                </div>
                <ul
                  className={
                    isHover && rowNumber === 1
                      ? "mm-collapse mm-show mobile-submenu"
                      : props.navigationClick
                        ? "hide-navlink mm-collapse"
                        : (document.body.classList.contains("metismenu-navbar") || toggle) && (activeLink === '/campaign/manage' || activeLink === '/campaign/aggregate') ? 'mm-show' : "mm-collapse"
                  }
                >
                  <li>
                    <NavLink to="/campaign/manage">
                      {t("CAMPAIGN_MANAGEMENT")}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/campaign/aggregate">{t("ANALYTICS")}</NavLink>
                  </li>
                </ul>
              </li>
            )}
          {/* <li onMouseEnter={() => addClass(2)} onMouseLeave={removeClass}>
            <div className="nav-links">
              <SyncAltOutlinedIcon />
              <Link to="#" className="has-arrow mm-collapsed">
                {t("JOURNEY")}
              </Link>
            </div>
            <ul
              className={
                isHover && rowNumber === 2
                  ? "mm-collapse mm-show mobile-submenu"
                  : props.navigationClick
                    ? "hide-navlink mm-collapse"
                    : "mm-collapse"
              }
            >
              <li>
                <NavLink to="/journey1">
                  {t("JOURNEY").substring(0, t("JOURNEY").length - 1)} 1
                </NavLink>
              </li>
              <li>
                <NavLink to="/journey2">
                  {t("JOURNEY").substring(0, t("JOURNEY").length - 1)} 2
                </NavLink>
              </li>
            </ul>
          </li> */}
          <li className="single-nav">
            <div className={`${activeLink === '/journey' ? "nav-links active" : "nav-links"}`}>
              <SyncAltOutlinedIcon
                onClick={() => navigateAway("/journey")}
              />
              <NavLink
                to="/journey"
                className="has-arrow mm-collapsed"
              >
                {t("JOURNEY")}
              </NavLink>
            </div>
          </li>
          <li className="single-nav">
            <div className={`${activeLink === '/performance/report' ? "nav-links active" : "nav-links"}`}>
              <TrendingUp
                onClick={() => navigateAway("/performance/report")}
              />
              <NavLink
                to="/performance/report"
                className="has-arrow mm-collapsed"
              >
                {t("OVERALL_PERFORMANCE_REPORT")}
              </NavLink>
            </div>
          </li>
          {userHasPermission([
            "R_DRP_CAMPAIGN",
            "R_DRP_CAMPAIGN_OWN",
            "R_DRP_CAMPAIGN_OWN_ORG"]) && (
              <li className="single-nav">
                <div className={`${activeLink === '/data-rewards' ? "nav-links active" : "nav-links"}`}>
                  <BarChartOutlinedIcon
                    onClick={() => navigateAway("/data-rewards")}
                  />
                  <NavLink
                    to="/data-rewards"
                    className="has-arrow mm-collapsed"
                  >
                    {t("DATA_REWARDS")}
                  </NavLink>
                </div>
              </li>
            )}
          {/* <li onMouseEnter={() => addClass(3)} onMouseLeave={removeClass}>
          <li onMouseEnter={() => addClass(3)} onMouseLeave={removeClass}>
            <div className="nav-links">
              <BarChartOutlinedIcon />
              <NavLink to="#" className="has-arrow mm-collapsed">
                {t('DATA_REWARDS')}
              </NavLink>
            </div>
            <ul className={(isHover && rowNumber === 3) ? 'mm-collapse mm-show mobile-submenu' : props.navigationClick ? 'hide-navlink mm-collapse' : 'mm-collapse'}>
              <li><NavLink to="/data-rewards">{t('CAMPAIGN_MANAGEMENT')}</NavLink></li>
              <li><NavLink to="/data-rewards/global-analytics">{t('ANALYTICS')}</NavLink></li>
            </ul>
          </li>
          <li>
            <div className="nav-links">
              <AddLocationOutlinedIcon />{" "}
              <NavLink to="#" className="has-arrow mm-collapsed">
                {t('DR_ANYWHERE')}
              </NavLink>
            </div>
            <ul>
              <li></li>
            </ul>
          </li> */}

          {/* <li>
            <div className="nav-links">
              <FormatListBulletedIcon />
              <NavLink to="#" className="has-arrow mm-collapsed">
                {t('SURVEY')}
              </NavLink>
            </div>
            <ul>
              <li></li>
            </ul>
          </li>
          <li>
            <div className="nav-links">
              <ScreenLockPortraitOutlinedIcon />
              <NavLink to="#" className="has-arrow mm-collapsed">
                {t('DEVICE_LOCK')}
              </NavLink>
            </div>
            <ul>
              <li></li>
            </ul>
          </li> */}
          {canEnableSurvey() && < li className="single-nav">
            <div className={`${activeLink === '/survey/manage' ? "nav-links active" : "nav-links"}`}>
              <FormatListBulletedIcon
                onClick={() => navigateAway("/survey/manage")} />
              <NavLink to="/survey/manage" className="has-arrow mm-collapsed">
                {t('SURVEY')}
              </NavLink>
            </div>
          </li>}
          {(canEnablepreloadProfile() || canEnablePreloadApp() ||
            canEnablePreloadDevice()) && <li onMouseEnter={() => addClass(3)} onMouseLeave={removeClass} className={`${activeLink === '/virtual-preload' ? "nav-links active" : activeLink === '/virtual-preload/analytics' ? 'nav-links active' : activeLink === '/virtual-preload/management' ? 'nav-links active' : "nav-links"}`}>
              <div className={`${activeLink === '/virtual-preload' ? "nav-links active" : activeLink === '/virtual-preload/analytics' ? 'nav-links active' : activeLink === '/virtual-preload/management' ? 'nav-links active' : "nav-links"}`}>
                {/* <div className="nav-icon"> */}
                {/* // <img src={"/img/opb.svg"} alt="OOPB" /> */}
                <OopbSVGIcon />
                {/* </div> */}
                <Link to="#" className={`${(activeLink === '/virtual-preload' && toggle) ? "has-arrow" : (activeLink === '/virtual-preload/analytics' && toggle) ? 'has-arrow' : (activeLink === '/virtual-preload/management' && toggle) ? 'has-arrow' : "has-arrow mm-collapsed"}`}>
                  {t("VIRTUAL_PRELOAD")}
                </Link>
              </div>
              <ul
                className={
                  isHover && rowNumber === 3
                    ? "mm-collapse mm-show mobile-submenu"
                    : props.navigationClick
                      ? "hide-navlink mm-collapse"
                      : (document.body.classList.contains("metismenu-navbar") || toggle) && (activeLink === '/virtual-preload' || activeLink === '/virtual-preload/analytics' || activeLink === '/virtual-preload/management') ? "mm-show" : "mm-collapse"
                }
              >
                {canEnablepreloadProfile() && <li>
                  <NavLink exact to="/virtual-preload">
                    {t("PRELOAD_PROFILE")}
                  </NavLink>
                </li>}
                <li>
                  <NavLink exact to="/virtual-preload/analytics">
                    {t("ANALYTICS")}
                  </NavLink>
                </li>
                {(canEnablePreloadApp() || canEnablePreloadDevice()) && <li>
                  <NavLink exact to="/virtual-preload/management">
                    {t("MANAGEMENT")}
                  </NavLink>
                </li>}
              </ul>
            </li>}
          {userHasPermission(["R_AC", "R_AC_OWN_ORG"]) && (
            <li className="single-nav">
              <div className={`${activeLink === '/audience/manage' ? "nav-links active" : "nav-links"}`}>
                <GpsFixedOutlinedIcon
                  onClick={() => navigateAway("/audience/manage")}

                />
                <NavLink
                  to="/audience/manage"
                  className="has-arrow mm-collapsed"
                >
                  {t("AUDIENCES")}
                </NavLink>
              </div>
            </li>
          )}
          <li className="single-nav">
            <div className={`${activeLink === '/crm' ? "nav-links active" : "nav-links"}`}>
              <AssignmentOutlinedIcon
                onClick={() => navigateAway("/crm")}
              />
              <NavLink
                to="/crm"
                className="has-arrow mm-collapsed"
              >
                {t("CRM")}
              </NavLink>
            </div>
          </li>
          <li className="single-nav">
            <div className={`${activeLink === '/content-management' ? "nav-links active" : "nav-links"}`}>
              <SettingsOutlinedIcon
                onClick={() => navigateAway("/content-management")}
              />
              <NavLink
                to="/content-management"
                className="has-arrow mm-collapsed"
              >
                {t("CONTENT_MANAGEMENT")}
              </NavLink>
            </div>
          </li>
          {/* <li>
            <div className="nav-links">
              <AssignmentOutlinedIcon />
              <NavLink to="#" className="has-arrow mm-collapsed">
                {t("CRM")}
              </NavLink>
            </div>
            <ul>
              <li></li>
            </ul>
          </li> */}
          {/* <li>
            <div className="nav-links">
              <SettingsOutlinedIcon />
              <NavLink to="#" className="has-arrow mm-collapsed">
                {t("CONTENT_MANAGEMENT")}
              </NavLink>
            </div>
            <ul>
              <li></li>
            </ul>
          </li> */}

          {userHasPermission(['SUPER_ADMIN']) && (
            <li onMouseEnter={() => addClass(4)} onMouseLeave={removeClass} className={`${activeLink === '/agency/manage' ? "nav-links active" : activeLink === '/advertiser/manage' ? 'nav-links active' : activeLink === '/category/manage' ? 'nav-links active' : activeLink === '/organization/manage' ? 'nav-links active' : activeLink === '/organization/settings' ? 'nav-links active' : "nav-links"} admin`}>
              <div className={`${activeLink === '/agency/manage' ? "nav-links active" : activeLink === '/advertiser/manage' ? 'nav-links active' : activeLink === '/category/manage' ? 'nav-links active' : activeLink === '/organization/manage' ? 'nav-links active' : activeLink === '/organization/settings' ? 'nav-links active' : "nav-links"}`}>
                <AdminSVGIcon />
                <Link to="#"
                  className={`${(activeLink === '/agency/manage' && toggle) ? "has-arrow" : (activeLink === '/advertiser/manage' && toggle) ? 'has-arrow' : (activeLink === '/category/manage' && toggle) ? 'has-arrow' : (activeLink === '/organization/manage' && toggle) ? 'has-arrow' : (activeLink === '/organization/settings' && toggle) ? 'has-arrow' : "has-arrow mm-collapsed"}`}
                >
                  {t("ADMIN")}
                </Link>
              </div>
              <ul
                className={
                  isHover && rowNumber === 4
                    ? "mm-collapse mm-show mobile-submenu"
                    : props.navigationClick
                      ? "hide-navlink mm-collapse"
                      : (document.body.classList.contains("metismenu-navbar") || toggle) && (activeLink === '/agency/manage' || activeLink === '/advertiser/manage' || activeLink === '/category/manage' || activeLink === '/organization/manage' || activeLink === '/organization/settings') ? "mm-show" : "mm-collapse"
                }
              >
                {userHasPermission(['SUPER_ADMIN']) && (<li>
                  <NavLink exact to="/agency/manage">
                    {t("AGECNY_MGMT")}
                  </NavLink>
                </li>)}
                {userHasPermission(['SUPER_ADMIN']) && (<li>
                  <NavLink exact to="/advertiser/manage">
                    {t("ADVERTISER_MGMT")}
                  </NavLink>
                </li>)}
                {userHasPermission(['SUPER_ADMIN']) && (<li>
                  <NavLink exact to="/category/manage">
                    {t("CATEGORY_MGMT")}
                  </NavLink>
                </li>)}
                {userHasPermission(['SUPER_ADMIN']) && (<li>
                  <NavLink exact to="/organization/manage">
                    {t("ORGANIZATION_MANAGEMENT")}
                  </NavLink>
                </li>)}
                {userHasPermission(['SUPER_ADMIN']) && (<li>
                  <NavLink exact to="/organization/settings">
                    {t("ORGANIZATION_SETTINGS")}
                  </NavLink>
                </li>)}
              </ul>
            </li>
          )}
        </MetisMenu>
      </S.Navigation>
      {checkFormHaveUnsaved()}
    </S.Container >
  );
}

export default React.memo(SidebarView);
