import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";
import { ProviderUser } from "./hooks/userHooks";
import { I18nextProvider } from "react-i18next";
import { internationalization } from "@dr-one/utils";
import { GlobalProvider } from "./context/globalState";

const PageHome = lazy(() => import("./pages/home/PageHome"));
const OrganizationSettings = lazy(() => import("./pages/OrganizationSettings/OrganizationSettings"));
const AgencyManagePage = lazy(() => import("./pages/AgencyManage/AgencyMangePage"));
const AdvertiserManage = lazy(() => import("./pages/AdvertiserManage/AdvertiserManagePage"));
const CategoryManage = lazy(() => import("./pages/CategoryManage/CategoryManagePage"));
const OrganizationManage = lazy(() => import("./pages/OrganizationManage/OrganizationManage"));
const NewOrganization = lazy(() => import("./pages/OrganizationSettings/NewOrganization"));

export default function Routes({ user }: { user: any }) {
  return (
    <Suspense fallback="">
      <I18nextProvider i18n={internationalization}>
        <GlobalProvider>
          <ProviderUser value={{ user }}>
            <Router>
              <Route exact path="/home" component={PageHome} />
              <Route exact path="/organization/settings" component={OrganizationSettings} />
              <Route exact path="/agency/manage" component={AgencyManagePage} />
              <Route exact path="/advertiser/manage" component={AdvertiserManage} />
              <Route exact path="/category/manage" component={CategoryManage} />
              <Route exact path="/organization/edit/:id" component={OrganizationSettings} />
              <Route exact path="/organization/manage" component={OrganizationManage} />
              <Route exact path="/organization/new" component={NewOrganization} />
            </Router>
          </ProviderUser>
        </GlobalProvider>
      </I18nextProvider>
    </Suspense>
  );
}
