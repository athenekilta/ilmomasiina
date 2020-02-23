import React from 'react';

import _ from 'lodash';
import { CSVLink } from 'react-csv';

import { deleteSignupAsync } from '../../../modules/admin/actions';
import { Event } from '../../../modules/types';
import { useTypedDispatch } from '../../../store/reducers';
import { getSignupsArrayFormatted } from '../../../utils/signupUtils';

import 'react-table/react-table.css';
import '../Editor.scss';

type Props = {
  event: Event;
};

const SignupsTab = (props: Props) => {
  const { event } = props;

  const dispatch = useTypedDispatch();

  const signups = getSignupsArrayFormatted(event);

  return (
    <div>
      <CSVLink
        data={signups}
        separator={'\t'}
        filename={`${event.title} osallistujalista`}
      >
        Lataa osallistujalista
      </CSVLink>
      <br />
      <br />
      <table className="event.editor--signup-table table table-condensed table-responsive">
        <thead>
          <tr className="active">
            <th key="position">#</th>
            <th key="firstName">Etunimi</th>
            <th key="lastName">Sukunimi</th>
            <th key="email">Sähköposti</th>
            <th key="quota">Kiintiö</th>
            {_.map(event.questions, q => (
              <th key={q.id}>{q.question}</th>
            ))}
            <th key="timestamp">Ilmoittautumisaika</th>
            <th key="delete" />
          </tr>
        </thead>
        <tbody>
          {_.map(signups, (s, index) => (
            <tr key={`${s.id}-${index}`}>
              <td key="position">{index + 1}.</td>
              <td key="firstName">{s.Etunimi}</td>
              <td key="lastName">{s.Sukunimi}</td>
              <td key="email">{s['Sähköposti']}</td>
              <td key="quota">{s['Kiintiö']}</td>
              {_.map(event.questions, q => {
                const answer = s[q.question];
                return <td key={q.id}>{answer}</td>;
              })}
              <td key="timestamp">{s.Ilmoittautumisaika}</td>
              <td key="delete">
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    const confirmation = window.confirm(
                      'Oletko varma? Poistamista ei voi perua.'
                    );
                    if (confirmation) {
                      dispatch(deleteSignupAsync(s.id, event.id));
                    }
                  }}
                >
                  Poista
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SignupsTab;
