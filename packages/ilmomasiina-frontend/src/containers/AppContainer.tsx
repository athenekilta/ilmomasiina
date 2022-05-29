import React from 'react';

import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import { Branding } from '../branding';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { fullPaths } from '../paths';
import PageNotFound from '../routes/404/PageNotFound';
import AdminEventsList from '../routes/AdminEvents';
import AdminUsersList from '../routes/AdminUsers';
import AuditLog from '../routes/AuditLog';
import Editor from '../routes/Editor';
import EditSignup from '../routes/EditSignup';
import Events from '../routes/Events';
import Login from '../routes/Login/Login';
import SingleEvent from '../routes/SingleEvent';
import configureStore, { history } from '../store/configureStore';
import requireAuth from './requireAuth';

import 'react-toastify/scss/main.scss';
import '../styles/core.scss';

const { store, persistor } = configureStore();

type Props = {
  branding: Branding;
};

const AppContainer = ({ branding }: Props) => (
  <div className="layout-wrapper">
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConnectedRouter history={history}>
          <Header branding={branding} />
          <div className="page-wrapper">
            <Switch>
              <Route
                exact
                path={fullPaths().eventsList}
                component={Events}
              />
              <Route
                exact
                path={fullPaths().eventDetails(':slug')}
                component={SingleEvent}
              />
              <Route
                exact
                path={fullPaths().editSignup(':id', ':editToken')}
                component={EditSignup}
              />
              <Route
                exact
                path={fullPaths().adminLogin}
                component={Login}
              />
              <Route
                exact
                path={fullPaths().adminEventsList}
                component={requireAuth(AdminEventsList)}
              />
              <Route
                exact
                path={fullPaths().adminUsersList}
                component={requireAuth(AdminUsersList)}
              />
              <Route
                exact
                path={fullPaths().adminEditEvent(':id')}
                component={requireAuth(Editor)}
              />
              <Route
                exact
                path={fullPaths().adminAuditLog}
                component={requireAuth(AuditLog)}
              />
              <Route
                path="*"
                component={PageNotFound}
              />
            </Switch>
          </div>
          <Footer branding={branding} />
        </ConnectedRouter>
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
      </PersistGate>
    </Provider>
  </div>
);

export default AppContainer;
