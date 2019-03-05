import { injectReducer } from '../../store/reducers';
import adminWrapper from '../authWrapper';

export default store => ({
  path: `${PREFIX_URL}/admin`,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      (require) => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const Events = require('./containers/AdminEventListContainer').default;
        const reducer = require('./modules/events').default;

        /*  Add the reducer to the store on key 'events'  */
        injectReducer(store, { key: 'events', reducer });

        /*  Return getComponent   */
        cb(null, adminWrapper(Events, store));

        /* Webpack named bundle   */
      },
      'events',
    );
  },
});
