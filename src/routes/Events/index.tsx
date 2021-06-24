import React, { useEffect } from 'react';

import _ from 'lodash';
import moment from 'moment';
import { shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';
import { Spinner } from 'theme-ui';

import { getEvents, resetState } from '../../modules/events/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import signupState from '../../utils/signupStateText';
import TableRow from './TableRow';

import './EventList.scss';

const EventList = () => {
  const dispatch = useTypedDispatch();
  const { events, eventsLoadError } = useTypedSelector((state) => state.events, shallowEqual);

  useEffect(() => {
    dispatch(getEvents());
    return () => {
      dispatch(resetState());
    };
  }, []);

  if (eventsLoadError) {
    return (
      <div className="container">
        <h1>Hups, jotain meni pieleen</h1>
        <p>Tapahtumien lataus epäonnistui</p>
      </div>
    );
  }

  if (!events) {
    return (
      <div className="container">
        <h1>Tapahtumat</h1>
        <Spinner />
      </div>
    );
  }

  const eventsSorted = _.sortBy(events, ['date', 'title']);

  const tableRows = eventsSorted.flatMap((event) => {
    const eventState = signupState(event.date, event.registrationStartDate, event.registrationEndDate);

    const rows = [
      <TableRow
        className={eventState.class}
        title={<Link to={`${PREFIX_URL}/event/${event.id}`}>{event.title}</Link>}
        date={moment(event.date).format('DD.MM.YYYY')}
        signupStatus={eventState.label}
        signupCount={
          (event.quota.length < 2 && _.sumBy(event.quota, 'signupCount')) || 0
        }
        quotaSize={event.quota.length === 1 ? event.quota[0].size : undefined}
        key={event.id}
      />,
    ];

    if (event.quota.length > 1) {
      event.quota.map((quota) => rows.push(
        <TableRow
          className="child"
          title={quota.title}
          signupCount={Math.min(quota.signupCount, quota.size)}
          quotaSize={quota.size}
          key={`${event.id}-${quota.id}`}
        />,
      ));
    }

    if (event.openQuotaSize > 0) {
      rows.push(
        <TableRow
          className="child"
          title="Avoin"
          signupCount={Math.min(
            _.sum(event.quota.map((quota) => Math.max(0, quota.signupCount - quota.size))),
            event.openQuotaSize,
          )}
          quotaSize={event.openQuotaSize}
          key={`${event.id}-open`}
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

export default EventList;
