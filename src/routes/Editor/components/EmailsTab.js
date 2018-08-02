import React from 'react';
import PropTypes from 'prop-types';
import { Textarea } from 'formsy-react-components';
import './Editor.scss';

class EmailsTab extends React.Component {

  static propTypes = {
    onDataChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };

    this.handleChange = this.handleChange.bind(this);
  }

  updateState(updates) {
    this.setState(updates, () => {
      if (typeof this.props.onDataChange === 'function') {
        this.props.onDataChange(this.state.data);
      }
    });
  }

  handleChange(field, value) {
    this.updateState({
      data: { ...this.state.data, [field]: value },
    });
  }

  render() {
    return (
      <div>
        <Textarea
          rows={10}
          name="verification"
          value=""
          label="Vahvistusviesti sähköpostiin"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default EmailsTab;
