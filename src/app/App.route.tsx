import { Link, Route, Switch } from 'react-router-dom';
import React from 'react';

export const AppRoute = () => {
  return (
    <Switch>
      <Route path="/account/:id">
        {(routeProps) => {
          return (
            <>
              <div>account with id param {routeProps.match!.params.id}</div>
              <Link to="/">to index</Link>
            </>
          );
        }}
      </Route>
      <Route path="/">
        <div>index</div>
        <Link to="/account/11">to account</Link>
      </Route>
    </Switch>
  );
};
