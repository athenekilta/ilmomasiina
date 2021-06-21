import React from 'react';

import { CSVLink } from 'react-csv';

import { AdminEventGetResponse } from '../../../api/adminEvents';
import { deleteSignupAsync } from '../../../modules/admin/actions';
import { useTypedDispatch } from '../../../store/reducers';
import { getSignupsArrayFormatted } from '../../../utils/signupUtils';

import 'react-table/react-table.css';
import '../Editor.scss';

type Props = {
  event: AdminEventGetResponse;
};

const SignupsTab = ({ event }: Props) => {
  const dispatch = useTypedDispatch();

  const signups = getSignupsArrayFormatted(event);

  return (
    <div>
      <CSVLink
        data={signups} // TODO implement translated headers
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
            {event.questions.map((q) => (
              <th key={q.id}>{q.question}</th>
            ))}
            <th key="timestamp">Ilmoittautumisaika</th>
            <th key="delete" aria-label="Poista" />
          </tr>
        </thead>
        <tbody>
          {signups.map((signup, index) => (
            <tr key={signup.id}>
              <td key="position">
                {index + 1}
                .
              </td>
              <td key="firstName">{signup.firstName}</td>
              <td key="lastName">{signup.lastName}</td>
              <td key="email">{signup.lastName}</td>
              <td key="quota">{signup.quota}</td>
              {event.questions.map((question) => (
                <td key={question.id}>{signup.answers[question.id]}</td>
              ))}
              <td key="timestamp">{signup.createdAt}</td>
              <td key="delete">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    const confirmation = window.confirm(
                      'Oletko varma? Poistamista ei voi perua.',
                    );
                    if (confirmation) {
                      dispatch(deleteSignupAsync(signup.id, event.id));
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
