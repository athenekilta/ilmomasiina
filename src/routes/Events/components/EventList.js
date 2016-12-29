import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'lodash';
import Separator from '../../../components/Separator';
import './EventList.scss';

class TableRow extends React.Component {
  render() {
    const { title, link, date, signUpLabel, going, max, className } = this.props;

    return (
      <tr className={className}>
        <td className="title">{ link ? <Link to={link}>{title}</Link> : title }</td>
        <td className="date">{ date ? moment(date).format('DD.MM.YYYY') : '' }</td>
        <td className="signup" data-xs-prefix={signUpLabel ? 'Ilmoittautuminen ' : ''}>{signUpLabel}</td>
        <td className="going" data-xs-prefix={going || max ? 'Ilmoittautuneita: ' : ''}>
          { going || '' }{ max ? <Separator /> : '' }{ max || ''}
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
    const state = (event, starts, closes) => {
      const signUpStarts = moment(starts);
      const signUpCloses = moment(closes);
      const eventStarts = moment(event);
      const now = moment();

      const timeFormat = 'D.M. [klo] hh:mm';

      if (signUpStarts.isSameOrAfter(now)) {
        return {
          label: `Alkaa ${moment(signUpStarts).format(timeFormat)}.`,
          class: 'signup-not-opened',
        };
      }

      if (signUpCloses.isSameOrAfter(now)) {
        return {
          label: `Auki ${moment(signUpCloses).format(timeFormat)} asti.`,
          class: 'signup-opened',
        };
      }

      if (eventStarts.isSameOrAfter(now)) {
        return { label: 'Ilmoittautuminen päättynyt.', class: 'signup-closed' };
      }

      return { label: 'Päättynyt', class: 'event-ended' };
    };

    const tableRows = this.props.eventList.map((event) => {
      // If every quota has same registration start/end time, show that time only once
      const showOneLabel = () => {
        const startMin = _.min(event.quotas.map(n => n.signUpStarts));
        const endMin = _.min(event.quotas.map(n => n.signUpEnds));
        const startMax = _.max(event.quotas.map(n => n.signUpStarts));
        const endMax = _.max(event.quotas.map(n => n.signUpEnds));

        return (startMin === startMax && endMin === endMax);
      };

      const eventState = state(event.date, event.quotas[0].signUpStarts, event.quotas[0].signUpEnds);

      const rows = [
        <TableRow
          title={event.title}
          link={`/event/${event.id}`}
          date={event.date}
          signUpLabel={showOneLabel() ? eventState.label : ''}
          going={_.sumBy(event.quotas, 'going')}
          max={_.sumBy(event.quotas, 'max')}
          className={eventState.class}
          key={`e${event.id}`} />,
      ];

      if (event.quotas.length > 1) {
        event.quotas.map((quota, i) => {
          const quotaState = state(event.date, quota.signUpStarts, quota.signUpEnds);
          return rows.push(
            <TableRow
              title={quota.title}
              signUpLabel={!showOneLabel() ? quotaState.label : ''}
              going={quota.going}
              max={quota.max}
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
  date: React.PropTypes.number,
  link: React.PropTypes.string,
  signUpLabel: React.PropTypes.string,
  className: React.PropTypes.string,
  going: React.PropTypes.number,
  max: React.PropTypes.number,
};

EventList.propTypes = {
  eventList: React.PropTypes.array.isRequired,
  getEventList: React.PropTypes.func.isRequired,
};

export default EventList;
