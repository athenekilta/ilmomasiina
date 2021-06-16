import React from 'react';

import _ from 'lodash';

import { Event, Signup } from '../../../../modules/types';

type Props = {
  event: Event;
  signup: Signup;
};

const SignupStatus = (props: Props) => {
  const { event, signup } = props;
  const { status, position, quotaId } = signup;
  const { openQuotaSize } = event;
  const quotas = event.quota;

  if (!signup.status) return null;

  if (status == 'in-quota') {
    const quota = _.find(quotas, { id: quotaId })!;
    return (
      <p>
        Olet kiintiössä {quota.title} sijalla{' '}
        {`${position} / ${quota.size || ''}`}
      </p>
    );
  }

  if (status == 'in-open') {
    return (
      <p>
        Olet avoimessa kiintiössä sijalla ${position} / ${openQuotaSize}.
      </p>
    );
  }

  return <p>Olet jonossa sijalla {position}.</p>;
};

export default SignupStatus;
