import React, { Component, PropTypes } from 'react';
import { browserHistory, Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { syncHistoryWithStore } from 'react-router-redux';
import { PersistGate } from 'redux-persist/integration/react'


// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout';

import requireAuth from './requireAuth';

import Admin from '../routes/Admin/AdminEventsList';
import AdminUsers from '../routes/Admin/AdminUsersList';
import Editor from '../routes/Editor/Editor';
import Events from '../routes/Events/EventList';
import SingleEvent from '../routes/SingleEvent/SingleEvent';
import PageNotFound from '../routes/404/PageNotFound';
import EditSignup from '../routes/EditSignup/EditSignup';
import Login from '../routes/Login/Login';

class AppContainer extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    persistor: PropTypes.object.isRequired,
  };

  static shouldComponentUpdate() {
    return false;
  }

  render() {
    const { store, persistor } = this.props;
    const history = syncHistoryWithStore(browserHistory, store);

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <div style={{ height: '100%' }}>
            <CoreLayout>
              <Router history={history}>
                <Route path={`${PREFIX_URL}/`} component={Events} />
                <Route path={`${PREFIX_URL}/event/:id`} component={SingleEvent} />
                <Route path={`${PREFIX_URL}/signup/:id/:editToken`} component={EditSignup} />
                <Route path={`${PREFIX_URL}/login`} component={Login} />
                <Route path={`${PREFIX_URL}/admin`} component={requireAuth(Admin)} />
                <Route path={`${PREFIX_URL}/admin/users`} component={requireAuth(AdminUsers)} />
                <Route path={`${PREFIX_URL}/admin/edit/:id`} component={requireAuth(Editor)} />
                <Route path="*" component={PageNotFound} />
                <Route />
              </Router>
            </CoreLayout>
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
              pauseOnVisibilityChange
              draggable
              pauseOnHover
              transition={Flip}
            />
          </div>
        </PersistGate>
      </Provider>
    );
  }
}

export default AppContainer;
