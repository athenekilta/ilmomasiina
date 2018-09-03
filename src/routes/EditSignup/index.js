import { injectReducer } from '../../store/reducers';

export default store => ({
  path: 'signup/:id/:editToken',
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      (require) => {
        /*  Webpack - use require callback to define dependencies for bundling   */
        const EditSignup = require('./containers/EditSignupContainer').default;
        const reducer = require('./modules/editSignup').default;

        /*  Add the reducer to the store on key 'event'  */
        injectReducer(store, { key: 'editSignup', reducer });

        /*  Return getComponent   */
        cb(null, EditSignup);

        /* Webpack named bundle   */
      },
      'events',
    );
  },
});
