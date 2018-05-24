import { injectReducer } from '../../store/reducers';

export default store => ({
  path: 'login',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Login = require('./components/Login').default;
      const reducer = require('./modules/login').default;

      injectReducer(store, { key: 'login', reducer });

      cb(null, Login);
    }, 'login');
  },
});
