import React from 'react';

import FieldRow from '@tietokilta/ilmomasiina-components/src/components/FieldRow';
import Textarea from './Textarea';

const EmailsTab = () => (
  <FieldRow
    name="verificationEmail"
    as={Textarea}
    label="Vahvistusviesti sähköpostiin"
    rows={10}
  />
);

export default EmailsTab;
