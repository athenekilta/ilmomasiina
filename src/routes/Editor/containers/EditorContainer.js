import { connect } from 'react-redux';
import * as Actions from '../modules/editor';

import Editor from '../components/Editor';

const mapDispatchToProps = {
  updateEvent: Actions.updateEvent,
  updateEventField: Actions.updateEventField,
  getEventAsync: Actions.getEventAsync,
  publishEventAsync: Actions.publishEventAsync,
  updateEventAsync: Actions.updateEventAsync,
};

const mapStateToProps = state => ({
  event: state.editor.event,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Editor);
