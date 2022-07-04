import React from 'react';

import { ConnectedRouter } from 'connected-react-router';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import { fullPaths } from '@tietokilta/ilmomasiina-components/src/config/paths';
import EditSignup from '@tietokilta/ilmomasiina-components/src/routes/EditSignup';
import Events from '@tietokilta/ilmomasiina-components/src/routes/Events';
import SingleEvent from '@tietokilta/ilmomasiina-components/src/routes/SingleEvent';
import Footer from '../components/Footer';
import Header from '../components/Header';
import PageNotFound from '../routes/404/PageNotFound';
import AdminEventsList from '../routes/AdminEvents';
import AdminUsersList from '../routes/AdminUsers';
import AuditLog from '../routes/AuditLog';
import Editor from '../routes/Editor';
import Login from '../routes/Login';
import configureStore, { history } from '../store/configureStore';
import AuthProvider from './AuthProvider';

import 'react-toastify/scss/main.scss';
import '../styles/app.scss';

const { store, persistor } = configureStore();

const AppContainer = () => (
  <div className="layout-wrapper">
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConnectedRouter history={history}>
          <AuthProvider>
            <Header />
            <Container>
              <Switch>
                <Route exact path={fullPaths().eventsList}>
                  <Events />
                </Route>
                <Route exact path={fullPaths().eventDetails(':slug')}>
                  <SingleEvent />
                </Route>
                <Route exact path={fullPaths().editSignup(':id', ':editToken')}>
                  <EditSignup />
                </Route>
                <Route exact path={fullPaths().adminLogin}>
                  <Login />
                </Route>
                <Route exact path={fullPaths().adminEventsList}>
                  <AdminEventsList />
                </Route>
                <Route exact path={fullPaths().adminUsersList}>
                  <AdminUsersList />
                </Route>
                <Route exact path={fullPaths().adminEditEvent(':id')}>
                  <Editor />
                </Route>
                <Route exact path={fullPaths().adminAuditLog}>
                  <AuditLog />
                </Route>
                <Route path="*">
                  <PageNotFound />
                </Route>
              </Switch>
            </Container>
            <Footer />
          </AuthProvider>
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
