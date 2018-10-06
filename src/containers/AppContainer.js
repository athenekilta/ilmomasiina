import React, { Component, PropTypes } from 'react';
import { browserHistory, Router, IndexRoute, Route } from 'react-router';
import { Provider } from 'react-redux';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { syncHistoryWithStore } from 'react-router-redux';

// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout';

import Admin from '../routes/Admin/AdminEventsList';
import Editor from '../routes/Editor/Editor';
import Events from '../routes/Events/EventList';
import SingleEvent from '../routes/SingleEvent/SingleEvent';
import PageNotFound from '../routes/404/PageNotFound';
import EditSignup from '../routes/EditSignup/EditSignup';
import Login from '../routes/Login/Login';

class AppContainer extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  };

  static shouldComponentUpdate() {
    return false;
  }

  render() {
    const { store } = this.props;
    const history = syncHistoryWithStore(browserHistory, store);

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <CoreLayout>
            <Router history={history}>
              <Route path="/" component={Events} />
              <Route path="event/:id" component={SingleEvent} />
              <Route path="admin" component={Admin} />
              <Route path="admin/edit/:id" component={Editor} />
              <Route path="signup/:id/:editToken" component={EditSignup} />
              <Route path="login" component={Login} />
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
      </Provider>
    );
  }
}

export default AppContainer;
