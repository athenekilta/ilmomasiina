import React from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import { Input } from 'formsy-react-components';
import Spinner from 'react-spinkit';
import { toast } from 'react-toastify';
import Promise from 'bluebird';

async function minDelay(func, ms = 1000) {
  const res = await Promise.all([func, new Promise(resolve => setTimeout(resolve, ms))]);
  return res[0];
}

class UserForm extends React.Component {
  static propTypes = {
    createUserAsync: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false,
    };

    this.createUser = this.createUser.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
  }

  async createUser() {
    const { email } = this.state;

    this.setState({ loading: true });

    try {
      const res = await minDelay(this.props.createUserAsync({ email }), 1000);
    } catch (error) {
      toast.error('Käyttäjän luominen epäonnistui.', { autoClose: 2000 });
    }

    this.setState({ loading: false });
  }

  updateInputValue(field, value) {
    this.setState({
      email: value,
    });
  }

  render() {
    return (
      <Formsy.Form style={{ maxWidth: '300px' }}>
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
          onClick={ () => this.createUser() }
        >
          {this.state.loading ? <Spinner /> : 'Luo uusi käyttäjä'}
        </button>
      </Formsy.Form>
    );
  }
}

export default UserForm;
