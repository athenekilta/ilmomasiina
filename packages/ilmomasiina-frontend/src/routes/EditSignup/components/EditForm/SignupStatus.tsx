import React from 'react';

import { useTypedSelector } from '../../../../store/reducers';

const SignupStatus = () => {
  const { status, position, quota } = useTypedSelector((state) => state.editSignup.signup)!;
  const { openQuotaSize } = useTypedSelector((state) => state.editSignup.event)!;

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
