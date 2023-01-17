import React from 'react';

import { Col, Row, Spinner } from 'react-bootstrap';

import { linkComponent, useParams } from '../../config/router';
import { usePaths } from '../../contexts/paths';
import {
  SingleEventProps, SingleEventProvider, useSingleEventContext,
} from '../../modules/singleEvent';
import EventDescription from './components/EventDescription';
import QuotaStatus from './components/QuotaStatus';
import SignupCountdown from './components/SignupCountdown';
import SignupList from './components/SignupList';

const SingleEventView = () => {
  const {
    event, signupsByQuota, pending, error,
  } = useSingleEventContext();
  const Link = linkComponent();
  const paths = usePaths();

  if (error) {
    return (
      <div className="ilmo--loading-container">
        <h1>Hups, jotain meni pieleen</h1>
        <p>
          Tapahtumaa ei löytynyt. Se saattaa olla menneisyydessä tai poistettu.
        </p>
        <Link to={paths.eventsList}>Palaa tapahtumalistaukseen</Link>
      </div>
    );
  }

  if (pending) {
    return (
      <div className="ilmo--loading-container">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <Link to={paths.eventsList} style={{ margin: 0 }}>
        &#8592; Takaisin
      </Link>
      <Row>
        <Col sm={12} md={8}>
          <EventDescription />
        </Col>
        <Col sm={12} md={4}>
          <SignupCountdown />
          <QuotaStatus />
        </Col>
      </Row>
      {event!.signupsPublic && (
        <>
          <h2>Ilmoittautuneet</h2>
          {signupsByQuota!.map((quota) => (
            <SignupList
              key={quota.id}
              quota={quota}
            />
          ))}
        </>
      )}
    </>
  );
};

const SingleEvent = () => {
  const { slug } = useParams<SingleEventProps>();
  return (
    <SingleEventProvider slug={slug}>
      <SingleEventView />
    </SingleEventProvider>
  );
};

export default SingleEvent;
