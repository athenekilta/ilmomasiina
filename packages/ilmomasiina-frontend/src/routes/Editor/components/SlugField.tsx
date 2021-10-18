import React from 'react';

import { Form, InputGroup } from 'react-bootstrap';

export default (props: any) => {
  const domain = /^https?:\/\//.test(PREFIX_URL) ? PREFIX_URL.replace(/^https?:\/\//, '') : window.location.host;
  const prefix = `${domain}/event/`;
  return (
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>{prefix}</InputGroup.Text>
      </InputGroup.Prepend>
      <Form.Control {...props} />
    </InputGroup>
  );
};
