import React from 'react';

import _ from 'lodash';

import { useTypedSelector } from '../../../../store/reducers';
import { OPENQUOTA, QuotaSignups, WAITLIST } from '../../../../utils/signupUtils';
import TableRow from './TableRow';

import './SignupList.scss';

type Props = {
  quota: QuotaSignups;
};

function getTitle(quota: QuotaSignups) {
  switch (quota.id) {
    case WAITLIST:
      return 'Jonossa';
    case OPENQUOTA:
      return 'Avoin kiintiö';
    default:
      return quota.title!;
  }
}

const SignupList = ({ quota }: Props) => {
  const { signups } = quota;
  const { questions } = useTypedSelector((state) => state.singleEvent.event)!;
  const showQuotas = quota.id === OPENQUOTA || quota.id === WAITLIST;
  return (
    <div className="quota">
      <h3>{getTitle(quota)}</h3>
      {!signups?.length ? (
        <p>Ei ilmoittautumisia.</p>
      ) : (
        <table className="table table-condensed table-responsive">
          <thead>
            <tr className="active">
              <th key="position">Sija</th>
              <th key="attendee" style={{ minWidth: 90 }}>
                Nimi
              </th>
              {_.filter(questions, 'public').map((question) => (
                <th key={question.id}>
                  {question.question}
                </th>
              ))}
              {showQuotas && (
                <th key="quota">
                  Kiintiö
                </th>
              )}
              <th key="datetime" style={{ minWidth: 130 }}>
                Ilmoittautumisaika
              </th>
            </tr>
          </thead>
          <tbody>
            {signups.map((signup, i) => (
              <TableRow
                index={i + 1}
                signup={signup}
                showQuota={showQuotas}
                // eslint-disable-next-line react/no-array-index-key
                key={i}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SignupList;
