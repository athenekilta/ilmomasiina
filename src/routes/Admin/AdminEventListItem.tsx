import React from 'react';

import _ from 'lodash';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';

import Separator from '../../components/Separator';
import { Event } from '../../modules/types';

type Props = {
  onDelete: (eventId: string) => void;
  data: Event;
  signups: number;
};

const AdminEventListItem = (props: Props) => {
  const { data, onDelete, signups } = props;

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

        <a onClick={() => onDelete(data.id)}>Poista tapahtuma</a>
      </td>
    </tr>
  );
};

export default AdminEventListItem;
