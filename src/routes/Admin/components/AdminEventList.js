import React from 'react'
import _ from 'lodash'
import { Link } from 'react-router'
import './AdminEventList.scss'

/* Render a single item
*/

class AdminEventListItem extends React.Component {
  render () {
    return (
      <tr>
        <td><Link to={`/event/${this.props.data.id}`}>{ this.props.data.name }</Link></td>
        <td>{this.props.data.date}</td>
        <td>Avoinna</td>
        <td>{ _.sumBy(this.props.data.quota, n => n.going) }</td>
        <td><Link className="btn btn-default">Lataa osallistujatiedot</Link></td>
        <td><Link className="btn btn-warning">Muokkaa tapahtumaa</Link></td>
      </tr>
    )
  }
}

/* Render the list container
*/

class AdminEventList extends React.Component {
  componentWillMount () {
    this.props.getAdminEventList()
  }

  render () {
    return (
      <div>
        <h1>Kaikki tapahtumat</h1>
        <table className='table'>
          <thead className='tableHeads'><tr>
            <td>Nimi</td>
            <td>Ajankohta</td>
            <td>Tila</td>
            <td>Ilmoittautuneita</td>
          </tr></thead>
          <tbody>
            { this.props.eventList.map( (i, index) => <AdminEventListItem key={index} data={i} />) }
          </tbody>
        </table>
        <nav className="text-center">
          <ul className="pagination">
            <li><a href="#">&laquo;</a></li>
            <li><a href="#">1</a></li>
            <li><a href="#">2</a></li>
            <li><a href="#">3</a></li>
            <li><a href="#">4</a></li>
            <li><a href="#">5</a></li>
            <li><a href="#">&raquo;</a></li>
          </ul>
        </nav>
      </div>
    )
  }

}

AdminEventListItem.propTypes = {
  data: React.PropTypes.object.isRequired
}

AdminEventList.propTypes = {
  eventList     : React.PropTypes.array.isRequired,
  getAdminEventList : React.PropTypes.func.isRequired
}

export default AdminEventList
