import { connect } from 'react-redux';
import * as Actions from '../modules/editor';

import Editor from '../components/Editor';

const mapDispatchToProps = {
  updateEvent: Actions.updateEvent,
  getEventAsync: Actions.getEventAsync,
};

const mapStateToProps = state => ({
  event: state.event,
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
