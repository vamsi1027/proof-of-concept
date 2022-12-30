import React from "react";
import { Route, Redirect } from "react-router-dom";
import { RouteType } from "../../models";

/* Prop definition */
type Props = {
  routes: RouteType[];
  redirect?: string;
  path?: string;
};

/**
 * Custom component to manege routes and redirects
 * @param routes - current context routes array
 * @param redirect - when condition return false
 * @param path - to nested the routes
 * @returns Routes array with redirect support
 */
const PathRoutesComponent: React.FunctionComponent<Props> = ({
  routes,
  redirect,
  path = "",
}) => {
  return (
    <React.Fragment>
      {routes.map((route, index) => (
        <React.Fragment key={`${index}_${route.name}`}>
          {route.condition === undefined ||
          (typeof route.condition === "function"
            ? route.condition()
            : route.condition) ? (
            <Route
              path={`${path}${route.path}`}
              component={route.component}
              exact={route.exact}
            />
          ) : (
            <Route path={`${path}${route.path}`} exact={route.exact}>
              <Redirect
                to={
                  route.redirect !== undefined
                    ? route.redirect
                    : redirect !== undefined
                    ? redirect
                    : "/"
                }
              />
            </Route>
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default React.memo(PathRoutesComponent);
