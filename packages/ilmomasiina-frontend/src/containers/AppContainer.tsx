import React from 'react';

import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import { Branding } from '../branding';
import Footer from '../components/Footer';
import Header from '../components/Header';
import paths from '../paths';
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
                path={paths.eventsList}
                component={Events}
              />
              <Route
                exact
                path={paths.eventDetails(':slug')}
                component={SingleEvent}
              />
              <Route
                exact
                path={paths.editSignup(':id', ':editToken')}
                component={EditSignup}
              />
              <Route
                exact
                path={paths.adminLogin}
                component={Login}
              />
              <Route
                exact
                path={paths.adminEventsList}
                component={requireAuth(AdminEventsList)}
              />
              <Route
                exact
                path={paths.adminUsersList}
                component={requireAuth(AdminUsersList)}
              />
              <Route
                exact
                path={paths.adminEditEvent(':id')}
                component={requireAuth(Editor)}
              />
              <Route
                exact
                path={paths.adminAuditLog}
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
