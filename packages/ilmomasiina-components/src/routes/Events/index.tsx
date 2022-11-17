import React from 'react';

import sum from 'lodash/sum';
import sumBy from 'lodash/sumBy';
import moment from 'moment-timezone';
import { Spinner, Table } from 'react-bootstrap';

import { timezone } from '../../config';
import { linkComponent } from '../../config/router';
import { usePaths } from '../../contexts/paths';
import {
  EventListProps, EventListProvider, useEventListContext, useEventListState,
} from '../../modules/events';
import signupState from '../../utils/signupStateText';
import TableRow from './components/TableRow';

const EventListView = () => {
  const { events, error, pending } = useEventListContext();
  const Link = linkComponent();
  const paths = usePaths();

  if (error) {
    return (
      <>
        <h1>Hups, jotain meni pieleen</h1>
        <p>Tapahtumien lataus epäonnistui</p>
      </>
    );
  }

  if (pending) {
    return (
      <>
        <h1>Tapahtumat</h1>
        <Spinner animation="border" />
      </>
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
        title={<Link to={paths.eventDetails(slug)}>{title}</Link>}
        date={date ? moment(date).tz(timezone()).format('DD.MM.YYYY') : ''}
        signupStatus={eventState}
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
          className="ilmo--quota-row"
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
          className="ilmo--quota-row"
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
    <>
      <h1>Tapahtumat</h1>
      <Table className="ilmo--event-list">
        <thead>
          <tr>
            <th>Nimi</th>
            <th>Ajankohta</th>
            <th>Ilmoittautuminen</th>
            <th>Ilmoittautuneita</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
    </>
  );
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
