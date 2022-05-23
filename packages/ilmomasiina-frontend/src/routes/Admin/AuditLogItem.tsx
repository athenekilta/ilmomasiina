import React from 'react';

import moment from 'moment-timezone';
import { Link } from 'react-router-dom';

import { AuditLog } from '@tietokilta/ilmomasiina-models/src/services/auditlog';
import paths from '../../paths';

type Props = {
  item: AuditLog.List.Item;
};

const ACTION_STRINGS = {
  'event.create': 'loi tapahtuman ',
  'event.edit': 'muokkasi tapahtumaa ',
  'event.publish': 'julkaisi tapahtuman ',
  'event.unpublish': 'palautti luonnokseksi tapahtuman ',
  'event.delete': 'poisti tapahtuman ',
  'signup.edit': 'muokkasi ilmoa ',
  'signup.delete': 'poisti ilmon ',
  'signup.queuePromote': 'ilmo nousi jonosta: ',
  'user.create': 'loi käyttäjän ',
  'user.delete': 'poisti käyttäjän ',
};

function describeAction(item: AuditLog.List.Item) {
  let extra: any = {};
  try {
    extra = JSON.parse(item.extra || '');
  } catch (err) { /* ignore */ }
  switch (item.action) {
    case 'event.create':
    case 'event.edit':
    case 'event.publish':
    case 'event.unpublish':
    case 'event.delete':
      return (
        <>
          {ACTION_STRINGS[item.action]}
          {item.eventId && <Link to={paths.adminEditEvent(item.eventId)}>{item.eventName}</Link>}
        </>
      );
    case 'signup.edit':
    case 'signup.delete':
    case 'signup.queuePromote':
      return (
        <>
          {`${ACTION_STRINGS[item.action]}${item.signupId} (${item.signupName}) tapahtumassa `}
          {item.eventId && <Link to={paths.adminEditEvent(item.eventId)}>{item.eventName}</Link>}
        </>
      );
    case 'user.create':
    case 'user.delete':
      return `${ACTION_STRINGS[item.action]}${extra.email}`;
    default:
      return `tuntematon toiminto ${item.action}`;
  }
}

const AuditLogItem = ({ item }: Props) => (
  <tr>
    <td>{moment(item.createdAt).tz('Europe/Helsinki').format('YYYY-MM-DD HH:mm:ss')}</td>
    <td>{item.user || '-'}</td>
    <td>{item.ipAddress || '-'}</td>
    <td>{describeAction(item)}</td>
  </tr>
);

export default AuditLogItem;
