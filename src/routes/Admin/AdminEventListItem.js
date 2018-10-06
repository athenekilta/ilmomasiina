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
  };

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

export default AdminEventListItem;
