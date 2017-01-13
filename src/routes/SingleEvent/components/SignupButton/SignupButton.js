import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import signupState from '../../../../utils/signupStateText';
import './SignupButton.scss';

export class SignupButton extends React.Component {
  render() {
    const now = moment();

    const isOpened = now.isSameOrAfter(moment(this.props.opens));
    const isClosed = now.isSameOrAfter(moment(this.props.closes));
    const isOpen = ((isOpened && !isClosed) || _.isEmpty(this.props.opens) || _.isEmpty(this.props.closes));

    const state = signupState(this.props.eventTime, this.props.opens, this.props.closes);

    return (
      <p>
        <button
          disabled={!isOpen}
          className="btn btn-success btn-block"
          onClick={() => (isOpen ? this.props.openForm() : {})}
        >
          {(this.props.isOnly ? 'Ilmoittaudu nyt' : `Ilmoittaudu: ${this.props.title}`)}
        </button>
        {this.props.showLabel ? state.label : ''}
      </p>
    );
  }
}

SignupButton.propTypes = {
  openForm: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  opens: React.PropTypes.string,
  closes: React.PropTypes.string,
  eventTime: React.PropTypes.string,
  isOnly: React.PropTypes.bool.isRequired,
  showLabel: React.PropTypes.bool.isRequired,
};

export default SignupButton;
