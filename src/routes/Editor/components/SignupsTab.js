import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment-timezone';
import SignupList from './SignupList';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../Editor.scss';
import { CSVLink } from 'react-csv';
import { WAITLIST, OPENQUOTA, getSignupsArrayFormatted } from '../../../utils/signupUtils';

class SignupsTab extends React.Component {
  static propTypes = {
    event: PropTypes.object,
  };

  renderTable(signups) {
    const { event } = this.props;
    return (
      <table className='table table-condensed table-responsive'>
        <thead>
          <tr className="active">
            <th key="position">#</th>
            <th key="firstName">Etunimi / Firstname</th>
            <th key="lastName">Sukunimi / Surname</th>
            <th key="email">Sähköposti / Email</th>
            <th key="quota">Kiintiö / Quota</th>
            {_.map(event.questions, q => <th key={q.id}>{q.question}</th>)}
            <th key="timestamp">Ilmoittautumisaika</th>
            <th key="delete" />
          </tr>
        </thead> />
        <tbody>
          {_.map(signups, (s, index) => (
            <tr key={s.id}>
              <td key="position">{index + 1}.</td>
              <td key="firstName">{s.Etunimi}</td>
              <td key="lastName">{s.Sukunimi}</td>
              <td key="email">{s['Sähköposti']}</td>
              <td key="quota">{s['Kiintiö']}</td>
              {_.map(event.questions, (q) => {
                const answer = s[q.question];
                return <td key={q.id}>{answer}</td>;
              })}
              <td key="timestamp">{s.Ilmoittautumisaika}</td>
              <td key="delete"><button className="btn btn-danger" onClick={() => {
                const confirmation = window.confirm('Oletko varma? Poistamista ei voi perua. / Are you sure? This cannot be undone.');
                if (confirmation) {
                  this.props.deleteSignup(s.id, event.id);
                }
              }}>Poista</button></td>
            </tr>
            ))}
        </tbody>
      </table>
    );
  }

  render() {
    const { event } = this.props;
    const signups = getSignupsArrayFormatted(event);

    if (!signups || signups.length === 0) {
      return (
        <div>
          <p>Tapahtumaan ei vielä ole yhtään ilmoittautumista. Kun tapahtumaan tulee ilmoittautumisia, näet ne tästä.</p>
          <p>There are no participants yet. However, you'll see them here</p>
        </div>
      );
    }

    return (
      <div>
        <CSVLink
          data={signups}
          separator={','}
          filename={`${event.title}.csv`}
          className="btn btn-default"
        >
          Lataa osallistujalista / Download participants
        </CSVLink>
        <br />
        <br />
        {this.renderTable(signups)}

        {/* {this.renderSignupLists(this.props.event)}
        {event.openQuotaSize ? (
          <SignupList
            title={'Avoin kiintiö'}
            questions={_.filter(formattedQuestions, 'public')}
            rows={openQuota}
            key={'openQuota'}
          />
        ) : null} */}
      </div>
    );
  }
}

export default SignupsTab;
