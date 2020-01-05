import React from "react";

import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";

// We only need to import the modules necessary for initial render
import CoreLayout from "../layouts/CoreLayout/CoreLayout";
import PageNotFound from "../routes/404/PageNotFound";
import Admin from "../routes/Admin/AdminEventsList";
import Editor from "../routes/Editor/Editor";
import EditSignup from "../routes/EditSignup/EditSignup";
import Events from "../routes/Events/EventList";
import Login from "../routes/Login/Login";
import SingleEvent from "../routes/SingleEvent/SingleEvent";
import configureStore, { history } from "../store/configureStore";
import requireAuth from "./requireAuth";

import "react-toastify/dist/ReactToastify.css";

const initialState = window.___INITIAL_STATE__; // eslint-disable-line no-underscore-dangle
const { store, persistor } = configureStore(initialState);

const AppContainer = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <div style={{ height: "100%" }}>
        <ConnectedRouter history={history}>
          <CoreLayout>
            <Switch>
              <Route exact path={`${PREFIX_URL}/`} component={Events} />
              <Route
                exact
                path={`${PREFIX_URL}/event/:id`}
                component={SingleEvent}
              />
              <Route
                exact
                path={`${PREFIX_URL}/signup/:id/:editToken`}
                component={EditSignup}
              />
              <Route exact path={`${PREFIX_URL}/login`} component={Login} />
              <Route
                exact
                path={`${PREFIX_URL}/admin`}
                component={requireAuth(Admin)}
              />
              <Route
                exact
                path={`${PREFIX_URL}/admin/edit/:id`}
                component={requireAuth(Editor)}
              />
              <Route path="*" component={PageNotFound} />
            </Switch>
          </CoreLayout>
        </ConnectedRouter>

        {/* <Router history={history} children={routes} /> */}
        {/* Global toast wrapper, use toast() function to display a message
         * https://github.com/fkhadra/react-toastify
         */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Flip}
        />
      </div>
    </PersistGate>
  </Provider>
);

export default AppContainer;
