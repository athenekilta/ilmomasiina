import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router';
import './AdminEventList.scss';

/* Render a single item
*/

class AdminEventListItem extends React.Component {
  render() {
    return (
      <tr>
        <td><Link to={`/event/${this.props.data.id}`}>{ this.props.data.name }</Link></td>
        <td>{moment(this.props.data.date).format('DD.MM.YYYY')}</td>
        <td>Luonnos</td>
        <td>{ _.sumBy(this.props.data.quota, n => n.going) }</td>
        <td><Link className="btn btn-default">Lataa osallistujatiedot</Link></td>
        <td><Link className="btn btn-warning">Muokkaa tapahtumaa</Link></td>
      </tr>
    );
  }
}

/* Render the list container
*/

class AdminEventList extends React.Component {
  componentWillMount() {
    this.props.getAdminEventList();
  }

  render() {
    return (
      <div>
        <Link to="/admin/edit" className="btn btn-success btn-lg pull-right">+ Uusi tapahtuma</Link>
        <h1>Hallinta</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Ajankohta</th>
              <th>Tila</th>
              <th>Ilmoittautuneita</th>
            </tr>
          </thead>
          <tbody>
            { this.props.eventList.map((i, index) => <AdminEventListItem key={index} data={i} />) }
          </tbody>
        </table>
      </div>
    );
  }

}

AdminEventListItem.propTypes = {
  data: React.PropTypes.object.isRequired,
};

AdminEventList.propTypes = {
  eventList: React.PropTypes.array.isRequired,
  getAdminEventList: React.PropTypes.func.isRequired,
};

export default AdminEventList;
