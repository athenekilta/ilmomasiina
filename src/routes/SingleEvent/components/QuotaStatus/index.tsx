import React from "react";
import _ from "lodash";
import { OPENQUOTA, WAITLIST } from "../../../../utils/signupUtils";
import ViewProgress from "../ViewProgress";
import { Event, Quota } from "../../../../modules/types";

type Props = {
  event: Event;
  quotaData: Quota;
};

const QuotaStatus = (props: Props) => {
  const { event, quotaData } = props;

  if (!event.quota || event.quota.length === 0 || !event.signupsPublic) {
    return null;
  }

  return (
    <div className="sidebar-widget">
      <h3>Ilmoittautuneet</h3>
      {_.map(_.keys(quotaData), quotaName => {
        const quota = quotaData[quotaName];
        if (quotaName === OPENQUOTA) {
          return (
            <ViewProgress
              title="Avoin"
              value={quota.signups.length}
              max={event.openQuotaSize}
              key={quotaName}
            />
          );
        }
        if (quotaName === WAITLIST) {
          if (quota.signups && quota.signups.length > 0) {
            return <p key={quotaName}>{`Jonossa: ${quota.signups.length}`}</p>;
          }
          return null;
        }
        return (
          <ViewProgress
            title={quotaName}
            value={Math.min(quota.signups.length, quota.size)}
            max={quota.size}
            key={quotaName}
          />
        );
      })}
    </div>
  );
};

export default QuotaStatus;
