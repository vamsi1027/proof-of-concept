import { Suspense } from 'react'
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom'

import PreloadAnalytics from "./pages/PreloadAnalytics";
import PreloadMangement from './pages/PreloadMangement/PreloadManagePage/PreloadManagePage';
import PreloadProfile from './pages/PreloadProfile/PreloadProfilePage/PreloadProfilePage';
import { I18nextProvider } from "react-i18next";
import { internationalization } from "@dr-one/utils";
import { GlobalProvider } from "./context/globalState";

export default function Routes({ user }: { user: any }) {
  return (
    <Suspense fallback="">
      <GlobalProvider>
        <I18nextProvider i18n={internationalization}>
          <Router>
            <Route exact path="/virtual-preload" component={PreloadProfile} />
            <Route exact path="/virtual-preload/analytics" component={PreloadAnalytics} />
            <Route exact path="/virtual-preload/management" component={PreloadMangement} />
          </Router>
        </I18nextProvider>
      </GlobalProvider>
    </Suspense>
  )
}
