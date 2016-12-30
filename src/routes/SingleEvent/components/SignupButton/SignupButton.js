import React from 'react';
import './SignupButton.scss';

export class SignupButton extends React.Component {
  render() {
    return <button className='btn btn-success btn-block' onClick={() => this.props.openForm()} >
      {this.props.title}</button>;
  }
}

SignupButton.propTypes = {
  openForm: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
};

export default SignupButton;
