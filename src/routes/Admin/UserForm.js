import React from 'react';

import Promise from 'bluebird';
import { Form, Input } from 'formsy-react-components';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';

async function minDelay(func, ms = 1000) {
  const res = await Promise.all([
    func,
    new Promise(resolve => setTimeout(resolve, ms)),
  ]);
  return res[0];
}

class UserForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };

    this.updateInputValue = this.updateInputValue.bind(this);
  }

  updateInputValue(field, value) {
    this.setState({
      email: value,
    });
  }

  render() {
    return (
      <Form style={{ maxWidth: '300px' }}>
        <Input
          id="email"
          placeholder="Sähköposti"
          name="email"
          title="Sähköposti"
          layout="elementOnly"
          value={this.state.email}
          onChange={this.updateInputValue}
          required
        />
        <button
          className="btn btn-default"
          style={{ marginTop: '1em' }}
          onClick={() => this.props.onSubmit(this.state.email)}
        >
          {this.props.loading ? <Spinner /> : 'Luo uusi käyttäjä'}
        </button>
      </Form>
    );
  }
}

export default UserForm;
