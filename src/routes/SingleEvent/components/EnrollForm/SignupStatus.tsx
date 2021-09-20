import React from 'react';

import _ from 'lodash';

import { useTypedSelector } from '../../../../store/reducers';

const SignupStatus = () => {
  const { status, position, quotaId } = useTypedSelector((state) => state.singleEvent.signup)!;
  const { quota: quotas, openQuotaSize } = useTypedSelector((state) => state.singleEvent.event)!;

  if (!status) return null;

  if (status === 'in-quota') {
    const quota = _.find(quotas, { id: quotaId })!;
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
