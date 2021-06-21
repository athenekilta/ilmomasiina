import React from 'react';

import { Label, Textarea } from '@theme-ui/components';
import { Field } from 'formik';

const EmailsTab = () => (
  <div className="form-group">
    <Label htmlFor="verificationEmail">Vahvistusviesti sähköpostiin</Label>
    <Field
      as={Textarea}
      name="verificationEmail"
      id="verificationEmail"
      rows={10}
    />
  </div>
);

export default EmailsTab;
