import React from 'react'
import { Link } from 'react-router'
import './EventList.scss'

/* Render a single item
*/

class EventListItem extends React.Component {
  render () {
    // TODO: rendering multiple quotas (kiintiöt)
    // TIP: http://stackoverflow.com/questions/25034994/how-to-correctly-wrap-few-td-tags-for-jsxtransformer

    return (
      <tr>
        <td><Link to={`/event/${this.props.data.id}`}>{this.props.data.name}</Link></td>
        <td>{this.props.data.date}</td>
        <td>Avoinna</td>
        <td>{this.props.data.quota[0].going}/{this.props.data.quota[0].max}</td>
      </tr>
    )
  }
}

/* Render the list container
*/

class EventList extends React.Component {
  componentWillMount () {
    this.props.getEventList()
  }

  render () {
    return (
      <div>
        <h2>TAPAHTUMAT</h2>
        <table className='table table-striped table-hover'>
          <thead className='tableHeads'><tr>
            <td>Nimi</td>
            <td>Ajankohta</td>
            <td>Ilmoittauminen</td>
            <td>Kiintiö</td>
          </tr></thead>
          <tbody>
            {
              this.props.eventList.map(
                (i, index) =>
                  <EventListItem key={index} data={i} />)
            }
          </tbody>
        </table>
      </div>
    )
  }

}

EventListItem.propTypes = {
  data: React.PropTypes.object.isRequired
}

EventList.propTypes = {
  eventList     : React.PropTypes.array.isRequired,
  getEventList : React.PropTypes.func.isRequired
}

export default EventList
