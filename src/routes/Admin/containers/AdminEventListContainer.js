import { connect } from 'react-redux';
import * as Actions from '../modules/events';

import AdminEventList from '../components/AdminEventList';

const mapDispatchToProps = {
  getAdminEventList: Actions.getAdminEventList,
  createUserAsync: Actions.createUserAsync,
};

const mapStateToProps = state => ({
  eventList: state.events,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminEventList);
