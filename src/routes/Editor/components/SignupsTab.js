import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment-timezone';
import SignupList from './SignupList';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../Editor.scss';
import { CSVLink } from "react-csv";
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
            <th key="firstName">Etunimi</th>
            <th key="lastName">Sukunimi</th>
            <th key="email">Sähköposti</th>
            <th key="quota">Kiintiö</th>
            {_.map(event.questions, q => {
              return <th key={q.id}>{q.question}</th>;
            })}
            <th key="timestamp">Ilmoittautumisaika</th>
            <th key="delete"></th>
          </tr>
        </thead>
        <tbody>
          {_.map(signups, (s, index) => {
            return (
              <tr key={s.id}>
                <td key="position">{index + 1}.</td>
                <td key="firstName">{s['Etunimi']}</td>
                <td key="lastName">{s['Sukunimi']}</td>
                <td key="email">{s['Sähköposti']}</td>
                <td key="quota">{s['Kiintiö']}</td>
                {_.map(event.questions, q => {
                  const answer = s[q.question];
                  return <td key={q.id}>{answer}</td>;
                })}
                <td key="timestamp">{s['Ilmoittautumisaika']}</td>
                <td key="delete"><button className="btn btn-danger" onClick={() => {
                  var confirmation = window.confirm("Oletko varma? Poistamista ei voi perua.")
                  if (confirmation) {
                    this.props.deleteSignup(s.id, event.id)
                  }

                }}>Poista</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  render() {
    const { event } = this.props
    const signups = getSignupsArrayFormatted(event);

    if (!signups || signups.length === 0) {
      return (
        <div>
          <p>Tapahtumaan ei vielä ole yhtään ilmoittautumista. Kun tapahtumaan tulee ilmoittautumisia, näet ne tästä.</p>
        </div>
      );
    }

    return (
      <div> 
        <CSVLink
          data={signups}
          separator={"\t"}
          filename={event.title + " osallistujalista"}
        >
          Lataa osallistujalista
        </CSVLink>
        <br />
        <br />
        <button className="btn btn-danger" onClick={() => {
                  var confirmation = window.confirm("Oletko varma? Poistamista ei voi perua.")
                  if (confirmation) {
                    this.props.deleteSignup(0, event.id)
        }}}> Remove all signups </button>
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
