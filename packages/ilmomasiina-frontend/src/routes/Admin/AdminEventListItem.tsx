import React, { MouseEvent } from 'react';

import _ from 'lodash';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AdminEvent } from '@tietokilta/ilmomasiina-models/src/services/admin/events';
import Separator from '../../components/Separator';
import { deleteEvent, getAdminEvents } from '../../modules/admin/actions';
import paths from '../../paths';
import { useTypedDispatch } from '../../store/reducers';
import { isEventInPast } from '../../utils/eventState';

type Props = {
  event: AdminEvent.List.Event;
};

const AdminEventListItem = ({ event }: Props) => {
  const dispatch = useTypedDispatch();

  const {
    id, title, date, draft, listed, quotas,
  } = event;

  async function onDelete(e: MouseEvent) {
    e.preventDefault();
    const confirmed = window.confirm(
      'Haluatko varmasti poistaa tämän tapahtuman? Tätä toimintoa ei voi perua.',
    );
    if (confirmed) {
      const success = await dispatch(deleteEvent(id));
      if (!success) {
        toast.error('Poisto epäonnistui :(', { autoClose: 2000 });
      }
      dispatch(getAdminEvents());
    }
  }

  let status;
  if (draft) {
    status = 'Luonnos';
  } else if (isEventInPast(event)) {
    status = date === null ? 'Sulkeutunut' : 'Mennyt';
  } else if (!listed) {
    status = 'Piilotettu';
  } else {
    status = 'Julkaistu';
  }

  return (
    <tr>
      <td>
        <Link to={paths.adminEditEvent(id)}>{title}</Link>
      </td>
      <td>{date ? moment(date).format('DD.MM.YYYY') : ''}</td>
      <td>{status}</td>
      <td>{_.sumBy(quotas, 'signupCount')}</td>
      <td>
        <Link to={paths.adminEditEvent(id)}>
          Muokkaa tapahtumaa
        </Link>

        <Separator />

        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" onClick={onDelete} role="button">
          Poista tapahtuma
        </a>
      </td>
    </tr>
  );
};

export default AdminEventListItem;
