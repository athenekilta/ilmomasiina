import React from 'react';

import { useSingleEventContext } from '../../../modules/singleEvent';
import { OPENQUOTA, WAITLIST } from '../../../utils/signupUtils';
import QuotaProgress from './QuotaProgress';

const QuotaStatus = () => {
  const { event, signupsByQuota } = useSingleEventContext();
  return (
    <div className="ilmo--side-widget">
      <h3>Ilmoittautuneet / Registrations</h3>
      {signupsByQuota!.map((quota) => {
        if (quota.id === OPENQUOTA) {
          return (
            <QuotaProgress
              key={quota.id}
              title="Avoin"
              value={quota.signupCount}
              max={event!.openQuotaSize}
            />
          );
        }
        if (quota.id === WAITLIST) {
          if (quota.signupCount > 0) {
            return <p key={quota.id}>{`Jonossa / in queue: ${quota.signupCount}`}</p>;
          }
          return null;
        }
        return (
          <QuotaProgress
            key={quota.id}
            title={quota.title!}
            value={quota.signupCount}
            max={quota.size || Infinity}
          />
        );
      })}
    </div>
  );
};

export default QuotaStatus;
