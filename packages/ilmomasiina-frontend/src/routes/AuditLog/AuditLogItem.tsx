import React from 'react';

import moment from 'moment-timezone';
import { Link } from 'react-router-dom';

import type { AuditLogItemSchema } from '@tietokilta/ilmomasiina-models';
import { AuditEvent } from '@tietokilta/ilmomasiina-models';
import appPaths from '../../paths';

type Props = {
  item: AuditLogItemSchema;
};

const ACTION_STRINGS: Record<AuditEvent, string> = {
  [AuditEvent.CREATE_EVENT]: 'loi tapahtuman ',
  [AuditEvent.EDIT_EVENT]: 'muokkasi tapahtumaa ',
  [AuditEvent.PUBLISH_EVENT]: 'julkaisi tapahtuman ',
  [AuditEvent.UNPUBLISH_EVENT]: 'palautti luonnokseksi tapahtuman ',
  [AuditEvent.DELETE_EVENT]: 'poisti tapahtuman ',
  [AuditEvent.EDIT_SIGNUP]: 'muokkasi ilmoa ',
  [AuditEvent.DELETE_SIGNUP]: 'poisti ilmon ',
  [AuditEvent.PROMOTE_SIGNUP]: 'ilmo nousi jonosta: ',
  [AuditEvent.CREATE_USER]: 'loi käyttäjän ',
  [AuditEvent.DELETE_USER]: 'poisti käyttäjän ',
  [AuditEvent.RESET_PASSWORD]: 'resetoi käyttäjän salasanan',
  [AuditEvent.CHANGE_PASSWORD]: 'vaihtoi salasanansa',
};

function describeAction(item: AuditLogItemSchema) {
  let extra: any = {};
  try {
    extra = JSON.parse(item.extra || '');
  } catch (err) { /* ignore */ }
  switch (item.action) {
    case AuditEvent.CREATE_EVENT:
    case AuditEvent.EDIT_EVENT:
    case AuditEvent.PUBLISH_EVENT:
    case AuditEvent.UNPUBLISH_EVENT:
    case AuditEvent.DELETE_EVENT:
      return (
        <>
          {ACTION_STRINGS[item.action]}
          {item.eventId && <Link to={appPaths.adminEditEvent(item.eventId)}>{item.eventName}</Link>}
        </>
      );
    case AuditEvent.EDIT_SIGNUP:
    case AuditEvent.DELETE_SIGNUP:
    case AuditEvent.PROMOTE_SIGNUP:
      return (
        <>
          {`${ACTION_STRINGS[item.action]}${item.signupId} (${item.signupName}) tapahtumassa `}
          {item.eventId && <Link to={appPaths.adminEditEvent(item.eventId)}>{item.eventName}</Link>}
        </>
      );
    case AuditEvent.CREATE_USER:
    case AuditEvent.DELETE_USER:
      return `${ACTION_STRINGS[item.action]}${extra.email}`;
    default:
      return `tuntematon toiminto ${item.action}`;
  }
}

const AuditLogItem = ({ item }: Props) => (
  <tr>
    <td>{moment(item.createdAt).tz(TIMEZONE).format('YYYY-MM-DD HH:mm:ss')}</td>
    <td>{item.user || '-'}</td>
    <td>{item.ipAddress || '-'}</td>
    <td>{describeAction(item)}</td>
  </tr>
);

export default AuditLogItem;
