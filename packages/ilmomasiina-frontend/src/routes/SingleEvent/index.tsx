import React from 'react';

import { Spinner } from 'react-bootstrap';
import { Link, RouteComponentProps } from 'react-router-dom';

import { paths } from '../../paths';
import EventDescription from './components/EventDescription';
import QuotaStatus from './components/QuotaStatus';
import SignupCountdown from './components/SignupCountdown';
import SignupList from './components/SignupList';
import { SingleEventProvider, useSingleEventContext, useSingleEventState } from './state';

import './SingleEvent.scss';

const SingleEventView = () => {
  const {
    event, signupsByQuota, pending, error,
  } = useSingleEventContext();

  if (error) {
    return (
      <div className="single-event">
        <div className="single-event--loading-container">
          <h1>Hups, jotain meni pieleen</h1>
          <p>
            Tapahtumaa ei löytynyt. Se saattaa olla menneisyydessä tai poistettu.
          </p>
          <Link to={paths().eventsList}>Palaa tapahtumalistaukseen</Link>
        </div>
      </div>
    );
  }

  if (pending) {
    return (
      <div className="single-event">
        <div className="single-event--loading-container">
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  return (
    <div className="container single-event">
      <Link to={paths().eventsList} style={{ margin: 0 }}>
        &#8592; Takaisin
      </Link>
      <div className="row">
        <div className="col-xs-12 col-sm-8">
          <EventDescription />
        </div>
        <div className="col-xs-12 col-sm-4 pull-right">
          <SignupCountdown />
          <QuotaStatus />
        </div>
      </div>
      {event!.signupsPublic && (
        <div className="event-signups">
          <h2>Ilmoittautuneet</h2>
          {signupsByQuota!.map((quota) => (
            <SignupList
              key={quota.id}
              quota={quota}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export interface MatchParams {
  slug: string;
}

const SingleEvent = ({ match }: RouteComponentProps<MatchParams>) => {
  const state = useSingleEventState(match.params);
  return (
    <SingleEventProvider value={state}>
      <SingleEventView />
    </SingleEventProvider>
  );
};

export default SingleEvent;
