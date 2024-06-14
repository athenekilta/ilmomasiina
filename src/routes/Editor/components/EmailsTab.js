import React from 'react';
import PropTypes from 'prop-types';
import { Textarea } from 'formsy-react-components';

class EmailsTab extends React.Component {
  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
    event: PropTypes.object,
  };

  render() {
    return (
      <div>
        <Textarea
          rows={10}
          name="verificationEmail"
          value={this.props.event.verificationEmail}
          label="Vahvistusviesti sähköpostiin"
          onChange={this.props.onDataChange}
        />
      </div>
    );
  }
}

export default EmailsTab;
