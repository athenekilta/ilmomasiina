import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Link } from 'react-router';
import _ from 'lodash';
import { CSVLink } from "react-csv";
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
          <Link to={`/event/${data.id}`}>{data.title}</Link>
        </td>
        <td>{data.date ? moment(data.date).format('DD.MM.YYYY') : ''}</td>
        <td>{data.draft ? "Luonnos" : "Julkaistu"}</td>
        <td>{signups}</td>
        <td>
          <Link to={`/admin/edit/${data.id}`}>Muokkaa tapahtumaa</Link>
          {/* {<Separator />
            <CSVLink
              data={signups}
              filename={data.title + " osallistujalista"}>Lataa osallistujalista</CSVLink> */}
          <Separator />

          <a onClick={() => this.props.onDelete(data.id)}>Poista tapahtuma</a>
        </td>
      </tr>
    );
  }
}

export default AdminEventListItem;
