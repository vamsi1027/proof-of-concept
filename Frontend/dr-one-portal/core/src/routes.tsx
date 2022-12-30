import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import { ProvideAuth } from "./hooks/auth";
import Login from "./pages/Login/LoginPage";
import Signup from "./pages/Signup/SignupPage";
import Portal from "./pages/Portal";
import Private from "./PrivateRoute";
import Report from "./pages/Report";
import RecoverPassword from "./pages/Recover-Password/RecoverPasswordPage";
import ResetPassword from "./pages/Reset-Password/ResetPasswordPage";
import Campaign from "./pages/Campaign";
import DataRewards from "./pages/DataRewards";
import UserManagement from "./pages/User-Management/UserManagement";
import CampaignAnalyticsAggregate from "./pages/CampaignAnalyticsAggregate";
import CampaignAnalyticsSpecific from "./pages/CampaignAnalyticsSpecific";
import PerformanceReport from "./pages/PerformanceReport";
import CheckMFAPage from "./pages/Check-MFA/CheckMFAPage";
import Audience from "./pages/Audience";
import VirtualPreload from "./pages/VirtualPreload";
import Admin from "./pages/Admin";
import BuildingFeatPage from "./pages/BuildingFeat/BuildingFeatPage";

import { I18nextProvider } from "react-i18next";
import { internationalization } from "@dr-one/utils";
import { useAuth } from "./hooks/auth";

export default function Routes({ name }) {
  const { user } = useAuth();

  return (
    <ProvideAuth>
      <I18nextProvider i18n={internationalization}>
        <Router getUserConfirmation={() => {
          /* Empty callback to block the default browser prompt */
        }}>
          <>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/check-mfa" component={CheckMFAPage} />
              <Route
                exact
                path="/recover-password"
                component={RecoverPassword}
              />
              <Route exact path="/reset-password" component={ResetPassword} />
              <Private exact path="/home" component={Portal} />
              <Private
                exact
                path="/campaign/manage"
                component={Campaign}
              />
              <Private exact path="/survey/manage" component={Campaign} />
              <Private exact path="/survey/new" component={Campaign} />
              <Private
                exact
                path="/campaign/manage/:id"
                component={CampaignAnalyticsSpecific}
              />
              <Private
                exact
                path="/campaign/manage/:id/:type"
                component={CampaignAnalyticsSpecific}
              />
              <Private
                exact
                path="/campaign/aggregate"
                component={CampaignAnalyticsAggregate}
              />
              <Private
                exact
                path="/performance/report"
                component={PerformanceReport}
              />
              <Private exact path="/report" component={Report} />
              <Private exact path="/campaign/new" component={Campaign} />
              <Private
                exact
                path="/campaign/edit/:id"
                component={Campaign}
              />
              <Private exact path="/audience/new" component={Audience} />
              <Private exact path="/audience/manage" component={Audience} />
              <Private exact path="/data-rewards" component={DataRewards} />
              <Private
                exact
                path="/data-rewards/analytics/:id"
                component={DataRewards}
              />
              <Private
                exact
                path="/data-rewards/createcampaign"
                component={DataRewards}
              />
              <Private exact path="/data-rewards/login" component={DataRewards} />
              <Private
                exact
                path="/data-rewards/global-analytics"
                component={() => <BuildingFeatPage feat="ANALYTICS" />}
              />
              <Private exact path="/data-rewards/createcampaign/:activeId/:campaignId" component={DataRewards} />
              <Private exact path="/data-rewards/error" component={DataRewards} />
              {/* <Private exact path="/" component={Portal} /> */}
              <Private exact path="/audience/edit/:id" component={Audience} />
              <Private
                exact
                path="/virtual-preload"
                component={VirtualPreload}
              />
              <Private
                exact
                path="/virtual-preload/analytics"
                component={VirtualPreload}
              />
              <Private
                exact
                path="/virtual-preload/management"
                component={VirtualPreload}
              />
              <Private
                exact
                path="/user-management"
                component={UserManagement}
              />
              <Private exact path="/organization/settings" component={Admin} />
              <Private exact path="/agency/manage" component={Admin} />
              <Private
                exact
                path="/advertiser/manage"
                component={Admin}
              />
              <Private
                exact
                path="/category/manage"
                component={Admin}
              />
              <Private exact path="/organization/manage" component={Admin} />
              <Private exact path="/organization/new" component={Admin} />
              <Private exact path="/organization/edit/:id" component={Admin} />
              <Private
                exact
                path="/journey"
                component={() => <BuildingFeatPage feat="JOURNEY" />}
              />
              <Private
                exact
                path="/crm"
                component={() => <BuildingFeatPage feat="CRM" />}
              />
              <Private
                exact
                path="/performance/report"
                component={() => <BuildingFeatPage feat="ANALYTICS" />}
              />
              <Private
                exact
                path="/content-management"
                component={() => <BuildingFeatPage feat="CONTENT_MANAGEMENT" />}
              />
              <Private
                exact
                path="/virtual-preload"
                component={() => <BuildingFeatPage feat="VIRTUAL_PRELOAD" />}
              />
              {/* <Private
                exact
                path="/campaign/aggregate"
                component={() => <BuildingFeatPage feat="ANALYTICS" />}
              /> */}
              <Route exact path="/" render={(props: any) =>
                (!user || !user?.organizationActive) ? (
                  <Redirect to="/login" />
                ) : (
                  <Redirect to="/" />
                )
              }></Route>
            </Switch>
            <GlobalStyle />
          </>
        </Router>
      </I18nextProvider>
    </ProvideAuth>
  );
}
