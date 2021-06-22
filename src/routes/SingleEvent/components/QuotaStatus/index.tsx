import React from 'react';

import { useTypedSelector } from '../../../../store/reducers';
import { getSignupsByQuota, OPENQUOTA, WAITLIST } from '../../../../utils/signupUtils';
import ViewProgress from '../ViewProgress';

const QuotaStatus = () => {
  const event = useTypedSelector((state) => state.singleEvent.event)!;

  if (!event.signupsPublic) {
    return null;
  }

  const quotaData = getSignupsByQuota(event);

  return (
    <div className="sidebar-widget">
      <h3>Ilmoittautuneet</h3>
      {quotaData!.map((quota) => {
        if (quota.id === OPENQUOTA) {
          return (
            <ViewProgress
              key={quota.id}
              title="Avoin"
              value={quota.signups.length}
              max={event.openQuotaSize}
            />
          );
        }
        if (quota.id === WAITLIST) {
          if (quota.signups.length > 0) {
            return <p key={quota.id}>{`Jonossa: ${quota.signups.length}`}</p>;
          }
          return null;
        }
        return (
          <ViewProgress
            key={quota.id}
            title={quota.title!}
            value={Math.min(quota.signups.length, quota.size)}
            max={quota.size}
          />
        );
      })}
    </div>
  );
};

export default QuotaStatus;
