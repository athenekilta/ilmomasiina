import React from 'react';

import _ from 'lodash';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Separator from '../../components/Separator';

/* Render a single item
 */

class AdminEventListItem extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    signups: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onDelete: PropTypes.func.isRequired,
  };

  render() {
    const { onDelete, onDownload, data, signups } = this.props;

    return (
      <tr>
        <td>
          <Link to={`${PREFIX_URL}/event/${data.id}`}>{data.title}</Link>
        </td>
        <td>{data.date ? moment(data.date).format('DD.MM.YYYY') : ''}</td>
        <td>{data.draft ? 'Luonnos' : 'Julkaistu'}</td>
        <td>{Number(signups)}</td>
        <td>
          <Link to={`${PREFIX_URL}/admin/edit/${data.id}`}>
            Muokkaa tapahtumaa
          </Link>

          <Separator />

          <a onClick={() => this.props.onDelete(data.id)}>Poista tapahtuma</a>
        </td>
      </tr>
    );
  }
}

export default AdminEventListItem;
