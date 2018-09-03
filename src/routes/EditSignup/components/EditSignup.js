import React from 'react';
import PropTypes from 'prop-types';

class EditSignup extends React.Component {
  static propTypes = {
    getSignupAsync: PropTypes.func.isRequired,
    error: PropTypes.bool,
    loading: PropTypes.bool,
    params: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { id, editToken } = this.props.params;
    this.props.getSignupAsync(id, editToken);
  }

  render() {
    console.log(this.props.signup);
    return <h1>TODO: Edit Signup</h1>;
  }
}

export default EditSignup;
