import React, { useState } from 'react';

import { Form, Input } from 'formsy-react-components';
import Spinner from 'react-spinkit';

type Props = {
  onSubmit: (email: string) => void;
  loading: boolean;
};

const UserForm = (props: Props) => {
  const { onSubmit, loading } = props;
  const [email, setEmail] = useState('');

  return (
    <Form style={{ maxWidth: '300px' }}>
      <Input
        id="email"
        placeholder="Sähköposti"
        name="email"
        title="Sähköposti"
        layout="elementOnly"
        value={email}
        onChange={(_field, value) => setEmail(value)}
        required
      />
      <button
        className="btn btn-default"
        style={{ marginTop: '1em' }}
        onClick={() => onSubmit(email)}
      >
        {loading ? <Spinner /> : 'Luo uusi käyttäjä'}
      </button>
    </Form>
  );
};

export default UserForm;
