import React from 'react';

import { OPENQUOTA, WAITLIST } from '../../../utils/signupUtils';
import { useSingleEventContext } from '../state';
import QuotaProgress from './QuotaProgress';

const QuotaStatus = () => {
  const { event, signupsByQuota } = useSingleEventContext();

  if (!event!.signupsPublic) {
    return null;
  }

  return (
    <div className="sidebar-widget">
      <h3>Ilmoittautuneet</h3>
      {signupsByQuota!.map((quota) => {
        if (quota.id === OPENQUOTA) {
          return (
            <QuotaProgress
              key={quota.id}
              title="Avoin"
              value={quota.signups.length}
              max={event!.openQuotaSize}
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
          <QuotaProgress
            key={quota.id}
            title={quota.title!}
            value={quota.signups.length}
            max={quota.size || Infinity}
          />
        );
      })}
    </div>
  );
};

export default QuotaStatus;
