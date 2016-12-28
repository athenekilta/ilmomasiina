import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import './EventList.scss';

/* Render a single item
*/

class EventListItem extends React.Component {
  render() {
    // TODO: rendering multiple quotas (kiintiöt)
    // TIP: http://stackoverflow.com/questions/25034994/how-to-correctly-wrap-few-td-tags-for-jsxtransformer

    return (
      <tr>
        <td><Link to={`/event/${this.props.data.id}`}>{this.props.data.name}</Link></td>
        <td>{moment(this.props.data.date).format('DD.MM.YYYY')}</td>
        <td>Avoinna</td>
        <td>{this.props.data.quota[0].going}/{this.props.data.quota[0].max}</td>
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
    return (
      <div>
        <h1>Tapahtumat</h1>
        <table className='table'>
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Ajankohta</th>
              <th>Ilmoittauminen</th>
              <th>Kiintiö</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.eventList.map(
                (i, index) =>
                  <EventListItem key={index} data={i} />)
            }
          </tbody>
        </table>
      </div>
    );
  }

}

EventListItem.propTypes = {
  data: React.PropTypes.object.isRequired,
};

EventList.propTypes = {
  eventList: React.PropTypes.array.isRequired,
  getEventList: React.PropTypes.func.isRequired,
};

export default EventList;
