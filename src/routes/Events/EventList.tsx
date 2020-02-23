import React, { useEffect } from 'react';

import _ from 'lodash';
import moment from 'moment';
import { shallowEqual } from 'react-redux';

import { getEvents } from '../../modules/events/actions';
import { Event } from '../../modules/types';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import signupState from '../../utils/signupStateText';
import TableRow from './TableRow';

import './EventList.scss';

const sortFunction = (event: Event) => {
  const now = moment();
  if (now.isAfter(moment(event.date))) return 2; // First upcoming events
  if (_.isEmpty(event.date)) return 1; // Then events without date
  return 0; // Default last events that are over
};

const EventList = () => {
  const dispatch = useTypedDispatch();
  const { events, eventError, eventLoading } = useTypedSelector(
    state => state.events,
    shallowEqual
  );

  useEffect(() => {
    dispatch(getEvents());
  }, []);

  const eventsSorted = _.sortBy(events, [sortFunction, 'date', 'title']);

  const tableRows = eventsSorted.map(event => {
    const eventState = signupState(
      event.date,
      event.registrationStartDate,
      event.registrationEndDate
    );

    const rows = [
      <TableRow
        title={event.title}
        link={`${PREFIX_URL}/event/${event.id}`}
        date={event.date}
        signupLabel={eventState.label}
        signups={
          (event.quota.length < 2 && _.sumBy(event.quota, 'signupCount')) || 0
        }
        size={event.quota.length < 2 ? _.sumBy(event.quota, 'size') : null}
        className={eventState.class}
        key={`e${event.id}`}
      />
    ];

    if (event.quota.length > 1) {
      event.quota.map((quota, i) =>
        rows.push(
          <TableRow
            title={quota.title}
            signups={Math.min(quota.signupCount, quota.size)}
            size={quota.size}
            className="child"
            key={`q${i}`}
          />
        )
      );
    }

    if (event.openQuotaSize > 0) {
      rows.push(
        <TableRow
          title="Avoin"
          signupLabel=""
          signups={Math.min(
            _.sum(event.quota.map(q => Math.max(0, q.signupCount - q.size))),
            event.openQuotaSize
          )}
          size={event.openQuotaSize}
          className="child"
          key={`open${event.id}`}
        />
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

export default EventList;
