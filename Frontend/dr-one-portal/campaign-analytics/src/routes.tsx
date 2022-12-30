import { Suspense } from "react";
import { Route, BrowserRouter as Router, Redirect } from "react-router-dom";
import { AggregateView, SpecificView } from "./views";
import { I18nextProvider } from "react-i18next";
import { internationalization } from "@dr-one/utils";
import { GlobalProvider } from './context/globalState'
import PerformanceReport from './views/aggregate/PerformanceReportNew/PerformanceReport';

export default function Routes({ user }: { user: any }) {
  return (
    <Suspense fallback="">
      <GlobalProvider>
        <I18nextProvider i18n={internationalization}>
          <Router>
            <Route exact path="/campaign/aggregate" component={AggregateView} />
            <Route
              exact
              path="/performance/report"
              component={PerformanceReport}
            />
            <Route exact path="/campaign/manage/:id" component={SpecificView} />
            <Route exact path="/campaign/manage/:id/:type" component={SpecificView} />

            <Route exact path="/">
              <Redirect to="/campaign/aggregate" />
            </Route>
          </Router>
        </I18nextProvider>
      </GlobalProvider>
    </Suspense>
  );
}
