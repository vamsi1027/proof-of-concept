import { ReactNode, useContext, createContext, useState } from "react";
import { apiDashboard, API_URL, emitEvent, helper, Mixpanel } from "@dr-one/utils";
import axios from "axios";
type PathName = {
  pathname?: string;
};
type IAuth = {
  user?: any;
  message?: any;
  signin?: (login: any, cb: (pathname?: PathName) => void, loc: string) => void;
  signinMFA?: (login: any, cb: (pathname?: PathName) => void) => void;
  changeActivePartner?: (partnerID: string) => void;
  changeMFAToOff?: () => void;
  handleClearMessage?: () => void;
  signout?: (cb: () => void) => void;
  getLastDurationbyDay?: (lastSessionTime: string) => number;
};

const authContext = createContext<IAuth>({});

function useProvideAuth(): IAuth {
  const [location, setLocation] = useState("");

  const [user, setUser] = useState<any>(() => {
    const tempUser = JSON.parse(localStorage.getItem("temp-user"));
    if (!!tempUser && new Date() < new Date(tempUser.expiration)) {
      return tempUser;
    }
    const [_, token] = document.cookie.split("t=");
    if (!token) {
      localStorage.removeItem("dr-user");
      localStorage.removeItem("temp-user");
      return undefined;
    } else {
      return JSON.parse(localStorage.getItem("dr-user"));
    }
  });
  const [message, setMessage] = useState<any>("NONE");

  // const getActivePartner = (partners: any[]): any => {
  //   const hasFlow = partners.findIndex(({ name }) => name === "Flowsense");
  //   return partners[hasFlow >= 0 ? hasFlow : 0];
  // };
  async function getUserDetails(updatedUser?: any) {
    const userDetail = updatedUser || user;
    const organizations = await axios.get(
      API_URL + "/api/users/list_organizations/",
      { headers: { Authorization: `Token ${userDetail.token}` } }
    );
    const organizationActive = `${organizations.data[0].id}`;
    const userDetails = await axios.get(API_URL + "/api/users/detail/", {
      headers: {
        Authorization: `Token ${userDetail.token}`,
        organization: organizationActive,
      },
    });
    const expires = new Date(userDetail.expiration);
    document.cookie = `t=${userDetail.token}; expires=${expires}; path=/; secure`;
    const drUser = {
      ...userDetails.data,
      organizations: organizations.data,
      organizationActive: organizationActive,
    };

    Mixpanel.register(
      {
        email: drUser.email,
        orgId: drUser.organizationActive,
        orgName: organizations.data[0].name,
      },
      getLastDurationbyDay(userDetail.last_session)
    );
    setUser(drUser);
    setMessage("NONE");
    localStorage.removeItem("temp-user");
    await getOrgDetails(userDetail, drUser).catch((error) => {
      console.log(error);
      localStorage.setItem("dr-user", JSON.stringify(drUser));
    });
  }

  async function getOrgDetails(userDetail: any, drUser: any) {
    const organizationIds = [];
    drUser.organizations.forEach((org) => {
      organizationIds.push(org.id);
    });

    const orgDetails = await axios.get(
      API_URL +
      `/campaign-mgmt-api/organizations/v1/?organizationIds=${organizationIds?.join(
        ", "
      )}`,
      {
        headers: {
          Authorization: `Token ${userDetail.token}`,
          organization: drUser.organizationActive,
        },
      }
    );
    const orgDetailsResponse = orgDetails?.data?.data;
    const orgDetailsArray = [];
    orgDetailsResponse.forEach((org) => {
      const orgIndex = drUser.organizations.findIndex(
        (orgData) => orgData.id === org.id
      );
      orgDetailsArray.push({
        name: org.name,
        timeZone: org.timeZone,
        videoImageSize: org.videoImageSize,
        notificationImageSize: org.notificationImageSize,
        noOfQuestions: org.noOfQuestions,
        mainImageSize: org.mainImageSize,
        enableSurvey: org.enableSurvey,
        bannerImageSize: org.bannerImageSize,
        countryISOCode: org.countryISOCode,
        fsImageSize: org.fsImageSize,
        gifImageSize: org.gifImageSize,
        id: org.id,
        logoFullPath: org.logoFullPath,
        legacy: orgIndex > -1 ? drUser.organizations[orgIndex].legacy : false,
      });
    });

    const modifiedDrUser = {
      email: drUser.email,
      name: drUser.name,
      organizationActive: drUser.organizationActive,
      organizations: orgDetailsArray,
      permissions: drUser.permissions,
    };
    localStorage.setItem("dr-user", JSON.stringify(modifiedDrUser));
  }

  const signin = async (login: any, cb, loc) => {
    setMessage("LOAD");
    const data: any = {
      password: login.password,
      email: login.email,
    };
    if (!!user && !!user.useMFA) {
      data.mfa_key = login.mfa;
    }
    try {
      const {
        data: { token, expiration, mfa_confirmed, qr_code, last_session },
      } = await axios.post(API_URL + "/auth/login/", data);

      if ("sideBarStatus" in localStorage) {
        const sideBarStatusArray = JSON.parse(
          localStorage.getItem("sideBarStatus")
        );
        const userIndex = sideBarStatusArray.findIndex(
          (user) => user.email === login.email
        );
        if (userIndex < 0) {
          sideBarStatusArray.push({ email: login.email, sidebar: "false" });
          localStorage.setItem(
            "sideBarStatus",
            JSON.stringify(sideBarStatusArray)
          );
        }
      } else {
        localStorage.setItem(
          "sideBarStatus",
          JSON.stringify([{ email: login.email, sidebar: "false" }])
        );
      }

      if (mfa_confirmed === false) {
        const tempUser = {
          email: login.email,
          token,
          expiration,
          mfa_confirmed,
          qr_code,
        };
        localStorage.setItem("temp-user", JSON.stringify(tempUser));
        setLocation(loc);
        setUser(tempUser);
        cb({ pathname: "/check-mfa" });
        setMessage("NONE");
      } else {
        await getUserDetails({
          email: login.email,
          token,
          expiration,
          last_session,
        });
        Mixpanel.identify(login.email);
        Mixpanel.people.set({
          $name: JSON.parse(localStorage.getItem("dr-user"))?.name,
          $email: login.email,
        });
        Mixpanel.track("Login", { mfa: !!data.mfa_key });
        cb({ pathname: helper.redirectPath() });
      }
    } catch (error) {
      if (error.response) {
        const loginErrorMessage = JSON.stringify(error.response);
        if (error.response.status >= 500) {
          setMessage("LOGIN_SERVER_ERROR");
        } else if (
          loginErrorMessage.includes("mfa confirmed on without key.")
        ) {
          setUser({ useMFA: true });
          setMessage("NONE");
        } else {
          setMessage(
            user?.useMFA ? "ERROR_TO_LOGIN_MFA_CODE" : "ERROR_TO_LOGIN"
          );
        }
      }
    }
  };
  const signinMFA = async (login: any, cb) => {
    setMessage("LOAD");
    const data: any = {
      mfa_key: login.mfa_key,
      user: login.email,
    };
    try {
      await axios.post(API_URL + "/auth/check_mfa/", data, {
        headers: { Authorization: `Token ${user.token}` },
      });
      await getUserDetails();
      cb({ pathname: location });
    } catch (error) {
      setMessage("MFA_CODE_WRONG");
    }
  };

  const userInfo = (loginInfo: any) => {
    const headers: any = {
      Authorization: "Token " + loginInfo.token,
      organization: loginInfo.organization,
    };

    axios
      .get("https://webapi-uat.digitalreef.com/api/users/detail/", { headers })
      .then(({ data }: { data: any }) => {
        emitEvent("react-core/user-data", data);
        localStorage.setItem("dr-user-info", JSON.stringify(data));
      })
      .catch(() => {
        setMessage("ERROR");
      });
  };

  const changeActivePartner = (partnerID: string) => {
    // const updatedUser = {
    //   ...user,
    //   activePartner: user.partners.find(
    //     ({ partner_uuid }) => partner_uuid === partnerID
    //   ),
    // };
    // emitEvent("[LOCAL APP NAME]/[NAME DATA]", updatedUser);
    // setUser(updatedUser);
  };
  const changeMFAToOff = () => {
    setUser({ useMFA: false });
  };
  const signout = (cb) => {
    Mixpanel.unregister({ email: user.email, orgId: user.organizationActive });
    setUser(undefined);
    localStorage.removeItem("dr-user");
    localStorage.removeItem("temp-user");
    sessionStorage.removeItem('initialCampaingDetails');
    sessionStorage.removeItem('enablePrompt');
    Mixpanel.track("Logout");
    cb();
  };
  const handleClearMessage = () => {
    setMessage("");
  };

  const getLastDurationbyDay = (lastSessionTime: string): number => {
    const MS_IN_DAY = 24 * 60 * 60 * 1000;
    // considering UTC time
    const lastSessionTimestamp = new Date(lastSessionTime + "z").getTime();

    return Math.floor((Date.now() - lastSessionTimestamp) / MS_IN_DAY);
  };

  return {
    user,
    message,
    signin,
    signout,
    signinMFA,
    handleClearMessage,
    changeMFAToOff,
    changeActivePartner,
    getLastDurationbyDay,
  };
}
export function useAuth() {
  return useContext(authContext);
}
export function ProvideAuth({ children }: { children: ReactNode }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
