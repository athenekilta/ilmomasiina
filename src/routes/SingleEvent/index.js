import { injectReducer } from '../../store/reducers';

export default store => ({
  path: 'event/:id',
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const SingleEvent = require('./containers/SingleEventContainer').default;
      const reducer = require('./modules/singleEvent').default;

      /*  Add the reducer to the store on key 'event'  */
      injectReducer(store, { key: 'singleEvent', reducer });

      /*  Return getComponent   */
      cb(null, SingleEvent);

      /* Webpack named bundle   */
    }, 'events');
  },
});
