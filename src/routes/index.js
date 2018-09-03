// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout';
import EventsRoute from './Events';
import SingleEventRoute from './SingleEvent';
import AdminRoute from './Admin';
import EditorRoute from './Editor';
import EditSignupRoute from './EditSignup';
import Login from './Login';
import PageNotFound from './404';

export const createRoutes = store => ({
  path: '/',
  component: CoreLayout,
  indexRoute: EventsRoute(store),
  childRoutes: [
    SingleEventRoute(store),
    AdminRoute(store),
    EditorRoute(store),
    EditSignupRoute(store),
    Login(store),
    PageNotFound,
  ],
});

export default createRoutes;
