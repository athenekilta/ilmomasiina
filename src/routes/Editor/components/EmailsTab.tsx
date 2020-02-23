import React from 'react';

import { Textarea } from '@theme-ui/components';

import { Event } from '../../../modules/types';

type Props = {
  event: Event;
  register: any;
};

const EmailsTab = ({ event, register }: Props) => (
  <Textarea
    rows={10}
    name="verificationEmail"
    label="Vahvistusviesti sähköpostiin"
    ref={register}
  />
);

export default EmailsTab;
