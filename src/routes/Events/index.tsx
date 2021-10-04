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
    const {
      slug, title, date, registrationStartDate, registrationEndDate, quotas, openQuotaSize,
    } = event;
    const eventState = signupState(date, registrationStartDate, registrationEndDate);

    const rows = [
      <TableRow
        className={eventState.class}
        title={<Link to={`${PREFIX_URL}/event/${slug}`}>{title}</Link>}
        date={moment(date).format('DD.MM.YYYY')}
        signupStatus={eventState.label}
        signupCount={
          (quotas.length < 2 ? _.sumBy(quotas, 'signupCount') : undefined)
        }
        quotaSize={quotas.length === 1 ? quotas[0].size : undefined}
        key={slug}
      />,
    ];

    if (quotas.length > 1) {
      quotas.map((quota) => rows.push(
        <TableRow
          className="child"
          title={quota.title}
          signupCount={quota.size ? Math.min(quota.signupCount, quota.size) : quota.signupCount}
          quotaSize={quota.size}
          key={`${slug}-${quota.id}`}
        />,
      ));
    }

    if (openQuotaSize > 0) {
      rows.push(
        <TableRow
          className="child"
          title="Avoin"
          signupCount={Math.min(
            _.sum(quotas.map((quota) => (quota.size ? Math.max(0, quota.signupCount - quota.size) : 0))),
            openQuotaSize,
          )}
          quotaSize={openQuotaSize}
          key={`${slug}-open`}
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
