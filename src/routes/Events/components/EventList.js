import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'lodash';
import Separator from '../../../components/Separator';
import './EventList.scss';
import signupState from '../../../utils/signupStateText';
import allTimesMatch from '../../../utils/allTimesMatch';

class TableRow extends React.Component {
  render() {
    const { title, link, date, signupLabel, signups, size, className } = this.props;

    return (
      <tr className={className}>
        <td key="title" className="title">{ link ? <Link to={link}>{title}</Link> : title }</td>
        <td key="date" className="date">{ date ? moment(date).format('DD.MM.YYYY') : '' }</td>
        <td key="signup" className="signup" data-xs-prefix={signupLabel ? 'Ilmoittautuminen ' : ''}>{signupLabel}</td>
        <td key="signups" className="signups" data-xs-prefix={signups || size ? 'Ilmoittautuneita: ' : ''}>
          { signups || 0 }{ size ? <Separator /> : '' }{ size || ''}
        </td>
      </tr>
    );
  }
}

/* Render the list container
*/

class EventList extends React.Component {
  componentWillMount() {
    this.props.getEventList();
  }

  render() {
    const sortFunction = (event) => {
      const now = moment();

      // First upcoming events
      if (now.isAfter(moment(event.date))) return 2;

      // Then events without date
      if (_.isEmpty(event.date)) return 1;

      // Default last events that are over
      return 0;
    };

    const eventsSorted = _.sortBy(this.props.eventList, [sortFunction, 'date', 'title']);

    const tableRows = eventsSorted.map((event) => {
      // If every quota has same registration start/end time, show that time only once
      const showOneLabel = allTimesMatch(event.quotas);

      const eventState = signupState(event.date, event.quotas[0].signupOpens, event.quotas[0].signupCloses);

      const rows = [
        <TableRow
          title={event.title}
          link={`/event/${event.id}`}
          date={event.date}
          signupLabel={showOneLabel ? eventState.label : ''}
          signups={_.sumBy(event.quotas, 'signups') || 0}
          size={_.sumBy(event.quotas, 'size')}
          className={eventState.class}
          key={`e${event.id}`} />,
      ];

      if (event.quotas.length > 1) {
        event.quotas.map((quota, i) => {
          const quotaState = signupState(event.date, quota.signupOpens, quota.signupCloses);
          return rows.push(
            <TableRow
              title={quota.title}
              signupLabel={!showOneLabel ? quotaState.label : ''}
              signups={quota.signups}
              size={quota.size}
              className={`${eventState.class} ${quotaState.class} child`}
              key={`q${i}`} />,
          );
        });
      }

      return rows;
    });

    return (
      <div className="container">
        <h1>Tapahtumat</h1>
        <table className="table eventlist">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Ajankohta</th>
              <th>Ilmoittautuminen</th>
              <th>Ilmoittautuneita</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    );
  }

}

TableRow.propTypes = {
  title: React.PropTypes.string.isRequired,
  date: React.PropTypes.string,
  link: React.PropTypes.string,
  signupLabel: React.PropTypes.string,
  className: React.PropTypes.string,
  signups: React.PropTypes.number,
  size: React.PropTypes.number,
};

EventList.propTypes = {
  eventList: React.PropTypes.array,
  getEventList: React.PropTypes.func.isRequired,
};

export default EventList;
