import React from 'react';

import { Textarea } from 'formsy-react-components';

import { Event } from '../../../modules/types';

type Props = {
  event: Event;
  onDataChange: (field: string, value: any) => void;
};

const EmailsTab = ({ event, onDataChange }: Props) => (
  <Textarea
    rows={10}
    name="verificationEmail"
    value={event.verificationEmail || ''}
    label="Vahvistusviesti sähköpostiin"
    onChange={onDataChange}
  />
);

export default EmailsTab;
