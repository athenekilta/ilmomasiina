import React, { MouseEvent } from 'react';

import sumBy from 'lodash/sumBy';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AdminEvent } from '@tietokilta/ilmomasiina-models/src/services/admin/events';
import { deleteEvent, getAdminEvents } from '../../modules/adminEvents/actions';
import appPaths from '../../paths';
import { useTypedDispatch } from '../../store/reducers';
import { isEventInPast } from '../../utils/eventState';

type Props = {
  event: AdminEvent.List.Event;
};

const AdminEventListItem = ({ event }: Props) => {
  const dispatch = useTypedDispatch();

  const {
    id, title, slug, date, draft, listed, quotas,
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
    status = <Link to={appPaths.eventDetails(slug)}>Julkaistu</Link>;
  }

  return (
    <tr>
      <td>
        <Link to={appPaths.adminEditEvent(id)}>{title}</Link>
      </td>
      <td>{date ? moment(date).tz(TIMEZONE).format('DD.MM.YYYY') : ''}</td>
      <td>{status}</td>
      <td>{sumBy(quotas, 'signupCount')}</td>
      <td>
        <Link to={appPaths.adminEditEvent(id)}>
          Muokkaa tapahtumaa
        </Link>
        &ensp;/&ensp;
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" onClick={onDelete} role="button">
          Poista tapahtuma
        </a>
      </td>
    </tr>
  );
};

export default AdminEventListItem;
