import React from 'react';

import _ from 'lodash';

import { Question, Signup } from '../../../../modules/types';
import { OPENQUOTA, WAITLIST } from '../../../../utils/signupUtils';
import TableRow from './TableRow';

import './SignupList.scss';

type Props = {
  questions: Question[];
  quotaName: string;
  signups: Signup[];
};

function getTitle(quotaName: string) {
  switch (quotaName) {
    case WAITLIST:
      return 'Jonossa';
    case OPENQUOTA:
      return 'Avoin kiintiö';
    default:
      return quotaName;
  }
}

const SignupList = (props: Props) => {
  const { questions, quotaName, signups } = props;

  return (
    <div className="quota">
      <h3>{getTitle(quotaName)}</h3>
      {!signups.length ? (
        <p>Ei ilmoittautumisia.</p>
      ) : (
        <table className="table table-condensed table-responsive">
          <thead>
            <tr className="active">
              <th key="position">Sija</th>
              <th key="attendee" style={{ minWidth: 90 }}>
                Nimi
              </th>
              {questions.map((q, i) => (
                <th key={i}>{q.question}</th>
              ))}
              <th key="datetime" style={{ minWidth: 130 }}>
                Ilmoittautumisaika
              </th>
            </tr>
          </thead>
          <tbody>
            {signups.map((signup, i) => (
              <TableRow
                questions={questions}
                answers={signup.answers}
                quota={signup.quota}
                firstName={signup.firstName}
                lastName={signup.lastName}
                createdAt={signup.createdAt}
                index={i + 1}
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
