import React from 'react';

import _ from 'lodash';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AdminEvent } from '../../api/adminEvents';
import Separator from '../../components/Separator';
import { deleteEvent, getAdminEvents } from '../../modules/admin/actions';
import { useTypedDispatch } from '../../store/reducers';

type Props = {
  event: AdminEvent.List.Event;
};

const AdminEventListItem = ({ event }: Props) => {
  const dispatch = useTypedDispatch();

  async function onDelete() {
    const confirmed = window.confirm(
      'Haluatko varmasti poistaa tämän tapahtuman? Tätä toimintoa ei voi perua.',
    );
    if (confirmed) {
      const success = await dispatch(deleteEvent(event.id));
      if (!success) {
        toast.error('Poisto epäonnistui :(', { autoClose: 2000 });
      }
      dispatch(getAdminEvents());
    }
  }

  return (
    <tr>
      <td>
        <Link to={`${PREFIX_URL}/event/${event.id}`}>{event.title}</Link>
      </td>
      <td>{event.date ? moment(event.date).format('DD.MM.YYYY') : ''}</td>
      <td>{event.draft ? 'Luonnos' : 'Julkaistu'}</td>
      <td>{_.sum(_.map(event.quota, 'signupCount'))}</td>
      <td>
        <Link to={`${PREFIX_URL}/admin/edit/${event.id}`}>
          Muokkaa tapahtumaa
        </Link>

        <Separator />

        <button type="button" className="btn btn-link" onClick={onDelete}>
          Poista tapahtuma
        </button>
      </td>
    </tr>
  );
};

export default AdminEventListItem;
