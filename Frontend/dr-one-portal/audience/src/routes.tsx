import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";
import { ProviderUser } from "./hooks/userHooks";
import { GlobalProvider } from "./context/globalState";
import { I18nextProvider } from "react-i18next";
import { internationalization } from "@dr-one/utils";
const PageHome = lazy(() => import("./pages/home/PageHome"));
const AudienceCreation = lazy(() => import("./pages/AudienceCreation/AudienceCreation"));
const AudienceManage = lazy(() => import("./pages/AudienceManage/AudienceManage"));

export default function Routes({ user }: { user: any }) {
  return (
    <Suspense fallback="">
      <ProviderUser value={{ user }}>
        <GlobalProvider>
        <I18nextProvider i18n={internationalization}>
        <Router>
          <Route exact path="/home" component={PageHome} />
          <Route exact path="/audience/new" component={AudienceCreation}/>
          <Route exact path="/audience/edit/:id" component={AudienceCreation}/>
          <Route exact path="/audience/manage" component={AudienceManage}/>
        </Router>
        </I18nextProvider>
        </GlobalProvider>
      </ProviderUser>
    </Suspense>
  );
}
