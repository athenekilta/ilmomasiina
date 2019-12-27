import React from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';

import signupState from '../../../../utils/signupStateText';

import './SignupButton.scss';

export class SignupButton extends React.Component {
  render() {
    const { isOpen } = this.props;

    return (
      <p>
        <button
          disabled={!isOpen}
          className="btn btn-default btn-block btn-whitespace-normal"
          onClick={() => (isOpen ? this.props.openForm() : {})}
        >
          {this.props.isOnly
            ? 'Ilmoittaudu nyt'
            : `Ilmoittaudu: ${this.props.title}`}
        </button>
      </p>
    );
  }
}

SignupButton.propTypes = {
  openForm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  eventTime: PropTypes.string,
  isOnly: PropTypes.bool.isRequired,
};

export default SignupButton;
