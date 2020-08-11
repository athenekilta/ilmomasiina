import React from 'react';
import _ from 'lodash';
import signupState from '../../../../utils/signupStateText';
import './SignupButton.scss';

export class SignupButton extends React.Component {
  render() {
    const isOpen = this.props.isOpen;

    return (
      <p>
        <button
          disabled={!isOpen}
          className="btn btn-default btn-block btn-whitespace-normal"
          onClick={() => (isOpen ? this.props.openForm() : {})}
        >
          {this.props.isOnly ? 'Ilmoittaudu / Register ' : `Ilmoittaudu / Register: ${this.props.title}`}
        </button>
      </p>
    );
  }
}

SignupButton.propTypes = {
  openForm: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  isOpen: React.PropTypes.bool.isRequired,
  eventTime: React.PropTypes.string,
  isOnly: React.PropTypes.bool.isRequired,
};

export default SignupButton;
