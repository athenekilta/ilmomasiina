import React from 'react';

import filter from 'lodash/filter';

import { OPENQUOTA, QuotaSignups, WAITLIST } from '../../../utils/signupUtils';
import { useSingleEventContext } from '../state';
import SignupListRow from './SignupListRow';

import './SignupList.scss';

type Props = {
  quota: QuotaSignups;
};

const SignupList = ({ quota }: Props) => {
  const { signups } = quota;
  const { questions, nameQuestion } = useSingleEventContext().event!;
  const showQuotas = quota.id === OPENQUOTA || quota.id === WAITLIST;
  return (
    <div className="quota">
      <h3>{quota.title}</h3>
      {!signups?.length ? (
        <p>Ei ilmoittautumisia.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm">
            <thead className="thead-light">
              <tr>
                <th key="position">Sija</th>
                {nameQuestion && (
                  <th key="attendee" style={{ minWidth: 90 }}>
                    Nimi
                  </th>
                )}
                {filter(questions, 'public').map((question) => (
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
                <SignupListRow
                  index={i + 1}
                  signup={signup}
                  showQuota={showQuotas}
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SignupList;
