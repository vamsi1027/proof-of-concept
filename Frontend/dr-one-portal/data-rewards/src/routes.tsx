import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { ProviderUser } from "./hooks/userHooks";

const PageDataRewards = lazy(
  () => import("./pages/DataRewards/PageDataRewards")
);
const DataRewadsAnalytics = lazy(
  () => import("./pages/DataRewadsAnalytics/DataRewadsAnalytics")
);
const DataRewadsAnalyticsGlobal = lazy(
  () => import("./pages/DataRewadsAnalyticsGlobal/DataRewadsAnalyticsGlobal")
);

export default function Routes({ user }: { user: any }) {
  return (
    <Suspense fallback="">
      <ProviderUser value={{ user }}>
        <Router>
          <Route exact path="/data-rewards" component={PageDataRewards} />
          <Route
            exact
            path="/data-rewards/analytics/:id"
            component={DataRewadsAnalytics}
          />
          <Route
            exact
            path="/data-rewards/global-analytics"
            component={DataRewadsAnalyticsGlobal}
          />
        </Router>
      </ProviderUser>
    </Suspense>
  );
}
