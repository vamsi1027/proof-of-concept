import { useHistory, Redirect } from "react-router-dom";
import { useAuth } from "../../../hooks/auth";
import React from "react";
import * as S from "./HeaderView.styles";
import { useEffect } from "react";
import ExpandLessOutlinedIcon from "@material-ui/icons/ExpandLessOutlined";
import LockOpenTwoToneIcon from "@material-ui/icons/LockOpenTwoTone";
import SettingsTwoToneIcon from "@material-ui/icons/SettingsTwoTone";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import MenuIcon from "@material-ui/icons/Menu";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import AccountBoxTwoToneIcon from "@material-ui/icons/AccountBoxTwoTone";
import InboxTwoToneIcon from "@material-ui/icons/InboxTwoTone";
import SwipeableDrawer from "@material-ui/core/Drawer";
import PublicTwoToneIcon from "@material-ui/icons/PublicTwoTone";
import {
  ListItemText,
  List,
  Divider,
  MenuItem,
  MenuList,
  Grow,
  Paper,
  Popper,
  ClickAwayListener,
  makeStyles,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { timezoneDetails, userHasPermission, helper } from "@dr-one/utils";

function HeaderView(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const { signout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const prevOpen = React.useRef(open);
  // const [drawer, setDrawer] = React.useState(false);
  const [leftMenu, setLeftMenu] = React.useState(false);
  const orgData = JSON.parse(localStorage.getItem("dr-user")).organizations;
  const user = JSON.parse(localStorage.getItem("dr-user"));
  const activeOrgIndex = orgData.findIndex(
    (org) => org.id === user.organizationActive
  );
  const filteredOrgDataWithoutActiveOrg = orgData.filter(
    (org) => org.id !== user.organizationActive
  );
  const [orgDateTime, setOrgDateTime] = React.useState(null);

  const useStyles = makeStyles((theme) => ({
    list: {
      width: 250,
    },
  }));
  const classes = useStyles();

  // const handleLang = (lang: string) => {
  //   i18n.changeLanguage(lang);
  // };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const logout = () => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
    signout(() => {
      history.push("/login");
      window.location.reload();
    });
  };

  const settings = () => {
    history.push("/user-management");
  };

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    setInterval(() => {
      setOrgDateTime(
        new Date().toLocaleString("en-US", {
          timeZone: user.organizations[activeOrgIndex].timeZone,
          weekday: "long",
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })
      );
    }, 1000);
    return () => {
      setOrgDateTime(null);
    };
  }, []);

  const toggleNavigation = () => {
    document.body.classList.toggle("metismenu-navbar");
    const loggedInUserEmail = JSON.parse(localStorage.getItem("dr-user")).email;
    const sideBarStatusArray = JSON.parse(
      localStorage.getItem("sideBarStatus")
    );
    const userIndex = sideBarStatusArray.findIndex(
      (user) => user.email === loggedInUserEmail
    );
    sideBarStatusArray[userIndex].sidebar = document.body.classList.contains(
      "metismenu-navbar"
    )
      ? "true"
      : "false";
    window.localStorage.setItem(
      "sideBarStatus",
      JSON.stringify(sideBarStatusArray)
    );

    props.navigationToggleClick(
      document.body.classList.contains("metismenu-navbar") ? true : false
    );
  };

  // const toggleDrawer = (event: any, value: boolean): void => {
  //   if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
  //     return;
  //   }
  //   setDrawer(value);
  // };

  const changeOrg = (organisation: any): void => {
    const orgData = {
      email: user.email,
      name: user.name,
      organizations: user.organizations,
      permissions: user.permissions,
      organizationActive: organisation.id
    };
    localStorage.setItem('dr-user', JSON.stringify(orgData));
    window.location.reload();
    window.location.href = helper.redirectPath();
  };

  const setTimezoneAbbr = (): string => {
    const timezone = user.organizations[activeOrgIndex].timeZone;
    let currentTimeZoneAbbr;
    for (const country of timezoneDetails) {
      const zonesData: any = country;
      if (zonesData) {
        for (const zone of zonesData.zones) {
          if (zone.java_code === timezone) {
            currentTimeZoneAbbr = zone.abbr;
            return currentTimeZoneAbbr;
          }
        }
        if (currentTimeZoneAbbr !== undefined) {
          break;
        }
      }
    }
  };

  const list = (anchor) => (
    <div
      className="sub-dropdown"
    // role="presentation"
    // onClick={(e) => toggleDrawer(anchor, false)}
    // onKeyDown={(e) => toggleDrawer(anchor, false)}
    >
      <List>
        {filteredOrgDataWithoutActiveOrg.map((org, index) => (
          <MenuItem button key={org.id} onClick={() => changeOrg(org)}>
            <img
              src={org?.logoFullPath ? org?.logoFullPath : "/img/user.png"}
              alt="org pic"
            />
            <ListItemText primary={org.name} />
          </MenuItem>
        ))}
        <Divider />
        {userHasPermission(["SUPER_ADMIN"]) && (
          <MenuItem className="add-new-btn" onClick={handleClose}>
            <AddOutlinedIcon fontSize="small" />
            <Link to="/organization/manage" className="link-settings">
              {t("ADD_NEW_BUTTON")}
            </Link>
          </MenuItem>
        )}
      </List>
    </div>
  );

  return (
    <S.Container>
      <div className="header-left">
        <div className="mob-nav-icon" onClick={toggleNavigation}>
          <MenuIcon />
        </div>

        <div className="location-text">
          <PublicTwoToneIcon />
          <p>{setTimezoneAbbr()}</p>
        </div>
      </div>
      <div className="header-right">
        <div className="profile-info">
          <p>{orgDateTime}</p>
          <div className="profile-image">
            <img src={"/img/user.png"} alt="User Image" />
          </div>
        </div>

        <ExpandLessOutlinedIcon
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          className={open ? "expand" : ""}
        />

        <div className="option-dropdown">
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList autoFocusItem={open} id="menu-list-grow">
                      <div className="user-details">
                        <div className="profile-image">
                          <img src={"/img/user.png"} alt="User Image" />
                        </div>
                        <div className="user-data-text">
                          <p className="user-name-text">
                            {user?.name || "User"}
                          </p>
                          <p className="user-email-text">
                            {user?.email || "user@email.com"}
                          </p>
                        </div>
                      </div>

                      {/* <MenuItem onClick={handleClose}><AccountBoxTwoToneIcon />{t('PROFILE')}</MenuItem>
                      <MenuItem onClick={handleClose}><InboxTwoToneIcon />{t('INBOX')}</MenuItem> */}
                      {userHasPermission(["SUPER_ADMIN"]) ? (
                        <MenuItem onClick={handleClose}>
                          <SettingsTwoToneIcon />
                          <Link to="/user-management" className="link-settings">
                            {t("SETTINGS")}
                          </Link>
                        </MenuItem>
                      ) : null}

                      {filteredOrgDataWithoutActiveOrg?.length !== 0 && (
                        <MenuItem className="drop-heading">
                          {t("ORGANIZATION")}
                        </MenuItem>
                      )}

                      {filteredOrgDataWithoutActiveOrg?.length !== 0 && (
                        <MenuItem
                          className="submenus"
                          onClick={(e) => setLeftMenu((leftMenu) => !leftMenu)}
                        >
                          <ArrowBackIosIcon />
                          {/* <ArrowBackIosIcon onClick={(e) => toggleDrawer('right', true)} /> */}
                          {/* <SwipeableDrawer transitionDuration={0} className="custom-dropdown"
                          anchor="right"
                          open={drawer}
                          onClose={(e) => toggleDrawer('right', false)}
                        // onOpen={(e) => toggleDrawer('right', true)}
                        > */}
                          {leftMenu && (
                            <div className="custom-dropdown">
                              {list("right")}
                            </div>
                          )}
                          {leftMenu && <div className="bg-backdrop"></div>}
                          {/* </SwipeableDrawer> */}
                          <img
                            src={
                              orgData[activeOrgIndex]?.logoFullPath
                                ? orgData[activeOrgIndex]?.logoFullPath
                                : "/img/user.png"
                            }
                            alt="org pic"
                          />
                          {orgData[activeOrgIndex].name}
                        </MenuItem>
                      )}
                      {filteredOrgDataWithoutActiveOrg?.length === 0 &&
                        userHasPermission(["SUPER_ADMIN"]) && (
                          <MenuItem className="add-new-btn">
                            <AddOutlinedIcon fontSize="small" />
                            <Link
                              to="/organization/manage"
                              className="link-settings"
                            >
                              {t("ADD_NEW_ORG_BUTTON")}
                            </Link>
                          </MenuItem>
                        )}
                      <MenuItem onClick={logout} className="logout">
                        <LockOpenTwoToneIcon />
                        {t("LOGOUT")}
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          {/*
            SAMPLE TO CHANGE LANGUAGES
            <p style={{color:'red'}} onClick={()=>handleLang('en')}>en</p>
            <p style={{color:'green'}} onClick={()=>handleLang('es')}>es</p>
            <p style={{color:'black'}} onClick={()=>handleLang('pt')}>pt</p>
          */}
        </div>
      </div>
    </S.Container>
  );
}

export default HeaderView;
