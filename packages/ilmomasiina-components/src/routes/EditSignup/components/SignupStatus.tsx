import React from 'react';

import { useEditSignupContext } from '../../../modules/editSignup';

const SignupStatus = () => {
  const { event, signup } = useEditSignupContext();
  const { status, position, quota } = signup!;
  const { openQuotaSize } = event!;

  if (!status) return null;

  if (status === 'in-quota') {
    return (
      <p>
        {`Olet kiintiössä ${quota.title} sijalla ${position}${quota.size ? ` / ${quota.size}` : ''}.`}
      </p>
    );
  }

  if (status === 'in-open') {
    return (
      <p>
        {`Olet avoimessa kiintiössä sijalla ${position} / ${openQuotaSize}.`}
      </p>
    );
  }

  return (
    <p>
      {`Olet jonossa sijalla ${position}.`}
    </p>
  );
};

export default SignupStatus;
