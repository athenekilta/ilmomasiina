import React from 'react';
import './SignupButton.scss';

export class SignupButton extends React.Component {
  render() {
    return <button className='btn btn-success btn-block' onClick={() => this.props.openForm()} >
      {this.props.data.quotaName}</button>;
  }
}

SignupButton.propTypes = {
  openForm: React.PropTypes.func.isRequired,
  data: React.PropTypes.shape({
    quotaName: React.PropTypes.string,
  }).isRequired,
};

export default SignupButton;
