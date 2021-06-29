import React from 'react';

import { Field } from 'formik';
import { Form, Row } from 'react-bootstrap';

const EmailsTab = () => (
  <Form.Group as={Row} controlId="verificationEmail">
    <Form.Label column sm={3}>Vahvistusviesti sähköpostiin</Form.Label>
    <Field
      as={(props: any) => <Form.Control as="textarea" {...props} />}
      name="verificationEmail"
      rows={10}
    />
  </Form.Group>
);

export default EmailsTab;
