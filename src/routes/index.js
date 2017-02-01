// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout';
import EventsRoute from './Events';
import SingleEventRoute from './SingleEvent';
import AdminRoute from './Admin';
import EditorRoute from './Editor';
import FourZeroFour from './404';

export const createRoutes = store => ({
  path: '/',
  component: CoreLayout,
  indexRoute: EventsRoute(store),
  childRoutes: [
    SingleEventRoute(store),
    AdminRoute(store),
    EditorRoute(store),
    FourZeroFour,
  ],
});

export default createRoutes;
