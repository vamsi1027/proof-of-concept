import { Route, Redirect } from "react-router-dom";

import BaseView from "./components/Layout/Base/BaseView";
import { useAuth } from "./hooks/auth";
import { Mixpanel } from "@dr-one/utils";

const Private = ({ component: Component, ...rest }: any) => {
  const { user } = useAuth();

  if ('dr-user' in localStorage) {
    const loggedInUserEmail = JSON.parse(localStorage.getItem('dr-user')).email;
    const sideBarStatusArray = JSON.parse(localStorage.getItem('sideBarStatus'));
    const userIndex = sideBarStatusArray.findIndex(user => user.email === loggedInUserEmail);
    if (sideBarStatusArray[userIndex]['sidebar'] === 'true') {
      document.body.classList.add('metismenu-navbar');
    } else {
      document.body.classList.remove('metismenu-navbar');
    }
    const activeOrgId = JSON.parse(localStorage.getItem('dr-user')).organizationActive;
    if (!!loggedInUserEmail && !!activeOrgId) {
      Mixpanel.register_once({
        email: loggedInUserEmail,
        orgId: activeOrgId
      });
    }
  }



  return (
    <Route
      {...rest}
      render={(props: any) =>
        !!user?.organizationActive ? (
          <BaseView>
            <div className="content-area">
              <Component {...props} />
            </div>
          </BaseView>
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default Private;
