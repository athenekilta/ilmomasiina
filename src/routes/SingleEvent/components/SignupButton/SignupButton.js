import React from 'react';
import moment from 'moment';
import signupState from '../../../../utils/signupStateText';
import './SignupButton.scss';

export class SignupButton extends React.Component {
  render() {
    const now = moment();

    const isOpened = moment(this.props.opens).isSameOrAfter(now);
    const isClosed = now.isSameOrAfter(moment(this.props.closes));

    const state = signupState(this.props.eventTime, this.props.opens, this.props.closes);

    return (
      <p className="text-center">
        <button
          disabled={(isOpened && !isClosed)}
          className='btn btn-success btn-block'
          onClick={() => this.props.openForm()}
        >
          {this.props.title}
        </button>
        {state.label}
      </p>
    );
  }
}

SignupButton.propTypes = {
  openForm: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  opens: React.PropTypes.string.isRequired,
  closes: React.PropTypes.string.isRequired,
  eventTime: React.PropTypes.string,
};

export default SignupButton;
