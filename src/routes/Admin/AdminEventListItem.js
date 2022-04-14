import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Link } from 'react-router';
import Separator from '../../components/Separator';

/* Render a single item
*/

class AdminEventListItem extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    signups: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  render() {
    const { onDelete, onDownload, data, signups } = this.props;

    return (
      <tr>
        <td>
          <Link to={`${PREFIX_URL}/admin/edit/${data.id}`}>{data.title}</Link>
        </td>
        <td>{data.date ? moment(data.date).format('DD.MM.YYYY') : ''}</td>
        <td>{data.draft ? 'Luonnos / Draft' : 'Julkaistu / Published'}</td>
        <td>{signups}</td>
        <td>
          <Link to={`${PREFIX_URL}/admin/edit/${data.id}`}>Muokkaa / Edit</Link>
          <Link to={`${PREFIX_URL}/event/${data.id}`}>Linkki ilmoittautumiseen</Link>

          <Separator />

          <a onClick={() => this.props.onDelete(data.id)}>Poista / Delete</a>
        </td>
      </tr>
    );
  }
}

export default AdminEventListItem;
