import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'lodash';
import Separator from '../../../components/Separator';
import './EventList.scss';
import signupState from '../../../utils/signupStateText';

class TableRow extends React.Component {
  render() {
    const { title, link, date, signupLabel, going, size, className } = this.props;

    return (
      <tr className={className}>
        <td key="title" className="title">{ link ? <Link to={link}>{title}</Link> : title }</td>
        <td key="date" className="date">{ date ? moment(date).format('DD.MM.YYYY') : '' }</td>
        <td key="signup" className="signup" data-xs-prefix={signupLabel ? 'Ilmoittautuminen ' : ''}>{signupLabel}</td>
        <td key="going" className="going" data-xs-prefix={going || size ? 'Ilmoittautuneita: ' : ''}>
          { going || '' }{ size ? <Separator /> : '' }{ size || ''}
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
    const tableRows = this.props.eventList.map((event) => {
      // If every quota has same registration start/end time, show that time only once
      const showOneLabel = () => {
        const startMin = _.min(event.quotas.map(n => n.signupOpens));
        const endMin = _.min(event.quotas.map(n => n.signupCloses));
        const startMax = _.max(event.quotas.map(n => n.signupOpens));
        const endMax = _.max(event.quotas.map(n => n.signupCloses));

        return (startMin === startMax && endMin === endMax);
      };

      const eventState = signupState(event.date, event.quotas[0].signupOpens, event.quotas[0].signupCloses);

      const rows = [
        <TableRow
          title={event.title}
          link={`/event/${event.id}`}
          date={event.date}
          signupLabel={showOneLabel() ? eventState.label : ''}
          going={_.sumBy(event.quotas, 'going')}
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
              signupLabel={!showOneLabel() ? quotaState.label : ''}
              going={quota.going}
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
  date: React.PropTypes.number,
  link: React.PropTypes.string,
  signupLabel: React.PropTypes.string,
  className: React.PropTypes.string,
  going: React.PropTypes.number,
  size: React.PropTypes.number,
};

EventList.propTypes = {
  eventList: React.PropTypes.array,
  getEventList: React.PropTypes.func.isRequired,
};

export default EventList;
