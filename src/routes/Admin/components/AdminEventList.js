import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router';
import UserForm from './UserForm';
import Separator from '../../../components/Separator';
import './AdminEventList.scss';

/* Render a single item
*/

class AdminEventListItem extends React.Component {
  render() {
    return (
      <tr>
        <td>
          <Link to={`/event/${this.props.data.id}`}>{this.props.data.title}</Link>
        </td>
        <td>{this.props.data.date ? moment(this.props.data.date).format('DD.MM.YYYY') : ''}</td>
        <td>Luonnos</td>
        <td>{_.sumBy(this.props.data.quota, n => n.going)}</td>
        <td>
          <Link to={`/admin/edit/${this.props.data.id}`}>Muokkaa tapahtumaa</Link>
          <Separator />
          <Link>Lataa osallistujalista</Link>
        </td>
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
      <div className="container">
        <h1>Hallinta</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Ajankohta</th>
              <th>Tila</th>
              <th>Ilmoittautuneita</th>
              <th>Toiminnot</th>
            </tr>
          </thead>
          <tbody>{this.props.eventList.map(i => <AdminEventListItem key={i.id} data={i} />)}</tbody>
        </table>
        <Link to="/admin/edit/new" className="btn btn-default">
          + Uusi tapahtuma
        </Link>
        <h1>Luo uusi käyttäjä</h1>
        <UserForm createUserAsync={this.props.createUserAsync} />
      </div>
    );
  }
}

AdminEventListItem.propTypes = {
  data: React.PropTypes.object.isRequired,
};

AdminEventList.propTypes = {
  createUserAsync: React.PropTypes.func.isRequired,
  eventList: React.PropTypes.array.isRequired,
  getAdminEventList: React.PropTypes.func.isRequired,
};

export default AdminEventList;
