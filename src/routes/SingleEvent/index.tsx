import React, { useEffect, useState } from 'react';

import moment from 'moment';
import { Spinner } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Quota } from '../../api/events';
import Autolink from '../../components/Autolink';
import { createPendingSignup, getEvent, resetState } from '../../modules/singleEvent/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import { getSignupsByQuota } from '../../utils/signupUtils';
import EnrollForm from './components/EnrollForm';
import QuotaStatus from './components/QuotaStatus';
import SignupCountdown from './components/SignupCountdown';
import SignupList from './components/SignupList';

import './SingleEvent.scss';

interface MatchParams {
  id: string;
}

type Props = RouteComponentProps<MatchParams>;

const SingleEvent = ({ match }: Props) => {
  const dispatch = useTypedDispatch();
  const {
    event, eventLoadError,
  } = useTypedSelector((state) => state.singleEvent, shallowEqual);

  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    dispatch(getEvent(match.params.id));
    return () => {
      dispatch(resetState());
    };
  }, [dispatch, match.params.id]);

  if (eventLoadError) {
    return (
      <div className="single-event">
        <div className="single-event--loading-container">
          <h1>Hups, jotain meni pieleen</h1>
          <p>
            Tapahtumaa ei löytynyt. Se saattaa olla menneisyydessä tai poistettu.
          </p>
          <Link to={`${PREFIX_URL}/`}>Palaa tapahtumalistaukseen</Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="single-event">
        <div className="single-event--loading-container">
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  async function beginSignup(quotaId: Quota.Id) {
    if (formOpen) return;
    const success = await dispatch(createPendingSignup(quotaId));
    if (success) {
      setFormOpen(true);
    } else {
      toast.error('Ilmoittautuminen epäonnistui.', {
        autoClose: 5000,
      });
    }
  }

  if (formOpen) {
    return (
      <EnrollForm
        closeForm={() => setFormOpen(false)}
        key={event.id}
      />
    );
  }

  const signupsByQuota = getSignupsByQuota(event);

  return (
    <div className="container single-event">
      <Link to={`${PREFIX_URL}/`} style={{ margin: 0 }}>
        &#8592; Takaisin
      </Link>
      <div className="row">
        <div className="col-xs-12 col-sm-8">
          <h1>{event.title}</h1>
          <div className="event-heading">
            {event.date && (
              <p>
                <strong>Ajankohta:</strong>
                {' '}
                {moment(event.date).format('D.M.Y [klo] HH:mm')}
              </p>
            )}
            {event.location && (
              <p>
                <strong>Sijainti:</strong>
                {' '}
                {event.location}
              </p>
            )}
            {event.price && (
              <p>
                <strong>Hinta:</strong>
                {' '}
                {event.price}
              </p>
            )}
            {event.webpageUrl && (
              <p>
                <strong>Kotisivut:</strong>
                {' '}
                <a href={event.webpageUrl} title="Kotisivut">
                  {event.webpageUrl}
                </a>
              </p>
            )}
            {event.facebookUrl && (
              <p>
                <strong>Facebook-tapahtuma:</strong>
                {' '}
                <a href={event.facebookUrl} title="Facebook-tapahtuma">
                  {event.facebookUrl}
                </a>
              </p>
            )}
          </div>
          <p className="event-description">
            <Autolink>{event.description}</Autolink>
          </p>
        </div>
        <div className="col-xs-12 col-sm-4 pull-right">
          <SignupCountdown beginSignup={beginSignup} />
          <QuotaStatus signups={signupsByQuota} />
        </div>
        <div className="col-xs-12">
          <h2>Ilmoittautuneet</h2>
          {signupsByQuota.map((quota) => (
            <SignupList
              key={quota.id}
              quota={quota}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleEvent;
