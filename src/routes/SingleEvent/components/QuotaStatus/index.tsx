import React from 'react';

import { useTypedSelector } from '../../../../store/reducers';
import { OPENQUOTA, QuotaSignups, WAITLIST } from '../../../../utils/signupUtils';
import ViewProgress from '../ViewProgress';

interface Props {
  signups: QuotaSignups[];
}

const QuotaStatus = ({ signups }: Props) => {
  const event = useTypedSelector((state) => state.singleEvent.event)!;

  if (!event.signupsPublic) {
    return null;
  }

  return (
    <div className="sidebar-widget">
      <h3>Ilmoittautuneet</h3>
      {signups.map((quota) => {
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
            value={quota.signups.length}
            max={quota.size || Infinity}
          />
        );
      })}
    </div>
  );
};

export default QuotaStatus;
