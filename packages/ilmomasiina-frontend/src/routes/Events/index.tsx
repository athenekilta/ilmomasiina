import React from 'react';

import sum from 'lodash/sum';
import sumBy from 'lodash/sumBy';
import moment from 'moment';
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { paths } from '../../paths';
import signupState from '../../utils/signupStateText';
import TableRow from './components/TableRow';
import { EventListProvider, useEventListContext, useEventListState } from './state';

import './EventList.scss';

const EventListView = () => {
  const { events, error, pending } = useEventListContext();

  if (error) {
    return (
      <div className="container">
        <h1>Hups, jotain meni pieleen</h1>
        <p>Tapahtumien lataus epäonnistui</p>
      </div>
    );
  }

  if (pending) {
    return (
      <div className="container">
        <h1>Tapahtumat</h1>
        <Spinner animation="border" />
      </div>
    );
  }

  const tableRows = events!.flatMap((event) => {
    const {
      id, slug, title, date, registrationStartDate, registrationEndDate, quotas, openQuotaSize,
    } = event;
    const eventState = signupState(registrationStartDate, registrationEndDate);

    const rows = [
      <TableRow
        className={eventState.class}
        title={<Link to={paths().eventDetails(slug)}>{title}</Link>}
        date={date ? moment(date).format('DD.MM.YYYY') : ''}
        signupStatus={eventState.label}
        signupCount={
          (quotas.length < 2 ? sumBy(quotas, 'signupCount') : undefined)
        }
        quotaSize={quotas.length === 1 ? quotas[0].size : undefined}
        key={id}
      />,
    ];

    if (quotas.length > 1) {
      quotas.map((quota) => rows.push(
        <TableRow
          className="child"
          title={quota.title}
          signupCount={quota.size ? Math.min(quota.signupCount, quota.size) : quota.signupCount}
          quotaSize={quota.size}
          key={`${id}-${quota.id}`}
        />,
      ));
    }

    if (openQuotaSize > 0) {
      rows.push(
        <TableRow
          className="child"
          title="Avoin"
          signupCount={Math.min(
            sum(quotas.map((quota) => (quota.size ? Math.max(0, quota.signupCount - quota.size) : 0))),
            openQuotaSize,
          )}
          quotaSize={openQuotaSize}
          key={`${id}-open`}
        />,
      );
    }

    return rows;
  });

  return (
    <div className="container">
      <h1>Tapahtumat</h1>
      <table className="table eventlist">
        <thead>
          <tr>
            <th>Nimi</th>
            <th>Ajankohta</th>
            <th>Ilmoittautuminen</th>
            <th>Ilmoittautuneita</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
};

export type EventListProps = {
  category?: string;
};

const EventList = ({ category }: EventListProps) => {
  const state = useEventListState({ category });
  return (
    <EventListProvider value={state}>
      <EventListView />
    </EventListProvider>
  );
};

export default EventList;
