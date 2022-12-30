import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { GlobalProvider } from "./context/globalState";
import { I18nextProvider } from "react-i18next";
import { internationalization } from "@dr-one/utils";

const PageHome = lazy(() => import("./pages/home/PageHome"));
const CampaignCreateContainer = lazy(() => import("./pages/CampaignCreateContainer/CampaignCreateContainer"));
const CampaignManagePage = lazy(() => import("./pages/CampaignManage/CampaignManagePage"));
const CampaignEditContainer = lazy(() => import("./pages/CampaignEditContainer/CampaignEditContainer"));
const SurveyManagePage = lazy(() => import("./pages/Survey/SurveyManagePage/SurveyManage"));
const SurveyCreate = lazy(() => import("./pages/Survey/SurveyManagePage/SurveyForm/SurveyCreation"));

export default function Routes({ user }: { user: any }) {
  return (
    <Suspense fallback="">
      <GlobalProvider>
        <I18nextProvider i18n={internationalization}>
          <Router>
            <Route exact path="/home" component={PageHome} />
            {/* <Route exact path="/">
            <Redirect to="/home" />
          </Route> */}
            <Route exact path="/campaign/new" component={CampaignCreateContainer} />
            <Route exact path="/campaign/manage" component={CampaignManagePage} />
            <Route exact path="/campaign/edit/:id" component={CampaignEditContainer} />
            <Route exact path="/survey/manage" component={SurveyManagePage} />
            <Route exact path="/survey/new" component={SurveyCreate} />
            {/* <Route exact path="/">
            <Redirect to="/campaign-manage" />
          </Route> */}
          </Router>
        </I18nextProvider>
      </GlobalProvider>
    </Suspense>
  );
}
