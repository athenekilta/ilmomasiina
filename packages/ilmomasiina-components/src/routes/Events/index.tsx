import React from 'react';

import { Spinner, Table } from 'react-bootstrap';

import { timezone } from '../../config';
import { linkComponent } from '../../config/router';
import { usePaths } from '../../contexts/paths';
import { EventListProps, EventListProvider, useEventListContext } from '../../modules/events';
import { eventsToRows, OPENQUOTA, WAITLIST } from '../../utils/eventListUtils';
import { signupStateText } from '../../utils/signupStateText';
import TableRow from './components/TableRow';

const EventListView = () => {
  const { events, error, pending } = useEventListContext();
  const Link = linkComponent();
  const paths = usePaths();

  if (error) {
    return (
      <>
        <h1>Hups, jotain meni pieleen / Something went wrong</h1>
        <p>Tapahtumien lataus epäonnistui / Could not load events.</p>
      </>
    );
  }

  if (pending) {
    return (
      <>
        <h1>Tapahtumat / Event</h1>
        <Spinner animation="border" />
      </>
    );
  }

  const tableRows = eventsToRows(events!).map((row, index) => {
    if (row.isEvent) {
      const {
        slug, title, date, signupState, signupCount, quotaSize,
      } = row;
      const stateText = signupStateText(signupState);
      return (
        <TableRow
          className={stateText.class}
          title={<Link to={paths.eventDetails(slug)}>{title}</Link>}
          date={date ? date.tz(timezone()).format('DD.MM.YYYY') : ''}
          signupStatus={stateText}
          signupCount={signupCount}
          quotaSize={quotaSize}
          key={slug}
        />
      );
    }
    if (row.title !== WAITLIST) {
      const { title, signupCount, quotaSize } = row;
      return (
        <TableRow
          className="ilmo--quota-row"
          title={title === OPENQUOTA ? 'Avoin' : title}
          signupCount={signupCount}
          quotaSize={quotaSize}
          // No real alternatives for key :(
          // eslint-disable-next-line react/no-array-index-key
          key={index}
        />
      );
    }
    return null;
  });

  return (
    <>
      <h1>Tapahtumat / Events</h1>
      <Table className="ilmo--event-list">
        <thead>
          <tr>
            <th>Nimi / Name</th>
            <th>Ajankohta / Date</th>
            <th>Ilmoittautuminen / Registration</th>
            <th>Ilmoittautuneita / Registered</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
    </>
  );
};

const EventList = ({ category }: EventListProps) => (
  <EventListProvider category={category}>
    <EventListView />
  </EventListProvider>
);

export default EventList;
