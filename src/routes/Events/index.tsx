import React, { useEffect } from 'react';

import _ from 'lodash';
import moment from 'moment';
import { Spinner } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';

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
  }, [dispatch]);

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
        <Spinner animation="border" />
      </div>
    );
  }

  const eventsSorted = _.sortBy(events, ['date', 'title']);

  const tableRows = eventsSorted.flatMap((event) => {
    const eventState = signupState(event.date, event.registrationStartDate, event.registrationEndDate);

    const rows = [
      <TableRow
        className={eventState.class}
        title={<Link to={`${PREFIX_URL}/event/${event.slug}`}>{event.title}</Link>}
        date={moment(event.date).format('DD.MM.YYYY')}
        signupStatus={eventState.label}
        signupCount={
          (event.quota.length < 2 ? _.sumBy(event.quota, 'signupCount') : undefined)
        }
        quotaSize={event.quota.length === 1 ? event.quota[0].size : undefined}
        key={event.slug}
      />,
    ];

    if (event.quota.length > 1) {
      event.quota.map((quota) => rows.push(
        <TableRow
          className="child"
          title={quota.title}
          signupCount={quota.size ? Math.min(quota.signupCount, quota.size) : quota.signupCount}
          quotaSize={quota.size}
          key={`${event.slug}-${quota.id}`}
        />,
      ));
    }

    if (event.openQuotaSize > 0) {
      rows.push(
        <TableRow
          className="child"
          title="Avoin"
          signupCount={Math.min(
            _.sum(event.quota.map((quota) => (quota.size ? Math.max(0, quota.signupCount - quota.size) : 0))),
            event.openQuotaSize,
          )}
          quotaSize={event.openQuotaSize}
          key={`${event.slug}-open`}
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
