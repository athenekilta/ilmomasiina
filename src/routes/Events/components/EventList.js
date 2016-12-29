import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'lodash';
import './EventList.scss';

class TableRow extends React.Component {
  render() {
    const { title, link, date, signUpLabel, going, max, className } = this.props;

    return (
      <tr className={className}>
        <td>{ link ? <Link to={link}>{title}</Link> : title }</td>
        <td>{ date ? moment(date).format('DD.MM.YYYY') : '' }</td>
        <td>{ signUpLabel }</td>
        <td>{ going || '' }{ max ? <span className="separator">/</span> : '' }{ max || ''}</td>
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
    const signUpLabel = (starts, closes) => {
      const startTime = moment(starts);
      const closeTime = moment(closes);
      const now = moment();

      const timeFormat = 'D.M. [klo] hh:mm';

      if (startTime.isSameOrAfter(now)) {
        return `Alkaa ${moment(startTime).format(timeFormat)}`;
      }

      if (closeTime.isSameOrAfter(now)) {
        return `Päättyy ${moment(closeTime).format(timeFormat)}`;
      }

      return 'Päättynyt';
    };

    const tableRows = this.props.eventList.map((event) => {
      const rows = [
        <TableRow
          title={event.title}
          link={`/event/${event.id}`}
          date={event.date}
          signUpLabel={event.quotas.length === 1 ? signUpLabel(event.quotas[0].signUpStarts, event.quotas[0].signUpEnds) : ''}
          going={_.sumBy(event.quotas, 'going')}
          max={_.sumBy(event.quotas, 'max')}
          className={moment().isSameOrAfter(moment(event.quotas[0].signUpEnds)) ? 'text-muted' : ''}
          key={`e${event.id}`} />,
      ];

      if (event.quotas.length > 1) {
        event.quotas.map((quota, i) =>
          rows.push(
            <TableRow
              title={quota.title}
              signUpLabel={signUpLabel(quota.signUpStarts, quota.signUpEnds)}
              going={quota.going}
              max={quota.max}
              className={moment().isSameOrAfter(quota.signUpEnds) ? 'text-muted child' : 'child'}
              key={`q${i}`} />,
          ),
        );
      }

      return rows;
    });

    return (
      <div>
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
  going: React.PropTypes.number.isRequired,
  max: React.PropTypes.number.isRequired,
};

EventList.propTypes = {
  eventList: React.PropTypes.array.isRequired,
  getEventList: React.PropTypes.func.isRequired,
};

export default EventList;
