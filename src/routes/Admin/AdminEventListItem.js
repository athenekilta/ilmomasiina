import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Link } from 'react-router';
import _ from 'lodash';

import Separator from '../../components/Separator';

/* Render a single item
*/

class AdminEventListItem extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    getEvents: PropTypes.func.isRequired
  };
  deleteEvent = () => {
    if (window.confirm("Haluatko varmasti poistaa tämän tapahtuman? Tätä toimintoa ei voi perua.")) {
      this.props.deleteEvent(this.props.data.id)
        .then((success) => {
          if (!success) {
            console.alert("Poisto epäonnistui :(")
          }
          this.props.getEvents()
        });
    }

  };
  render() {
    return (
      <tr>
        <td>
          <Link to={`/event/${this.props.data.id}`}>{this.props.data.title}</Link>
        </td>
        <td>{this.props.data.date ? moment(this.props.data.date).format('DD.MM.YYYY') : ''}</td>
        <td>{this.props.data.draft ? "Luonnos" : "Julkaistu"}</td>
        <td>{_.sumBy(this.props.data.quota, n => n.signupCount)}</td>
        <td>
          <Link to={`/admin/edit/${this.props.data.id}`}>Muokkaa tapahtumaa</Link>
          <Separator />
          <Link>Lataa osallistujalista</Link>
          <Separator />
          <a onClick={this.deleteEvent}>Poista tapahtuma</a>
        </td>
      </tr>
    );
  }
}

export default AdminEventListItem;
