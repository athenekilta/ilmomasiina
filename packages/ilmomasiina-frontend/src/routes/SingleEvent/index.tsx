import React, { useEffect } from 'react';

import moment from 'moment';
import { Spinner } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { shallowEqual } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import remarkGfm from 'remark-gfm';

import { Quota } from '@tietokilta/ilmomasiina-models/src/services/events';
import { createPendingSignup, getEvent, resetState } from '../../modules/singleEvent/actions';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';
import { getSignupsByQuota } from '../../utils/signupUtils';
import QuotaStatus from './components/QuotaStatus';
import SignupCountdown from './components/SignupCountdown';
import SignupList from './components/SignupList';

import './SingleEvent.scss';

interface MatchParams {
  slug: string;
}

type Props = RouteComponentProps<MatchParams>;

const SingleEvent = ({ match }: Props) => {
  const dispatch = useTypedDispatch();
  const {
    event, eventLoadError,
  } = useTypedSelector((state) => state.singleEvent, shallowEqual);

  useEffect(() => {
    dispatch(getEvent(match.params.slug));
    return () => {
      dispatch(resetState());
    };
  }, [dispatch, match.params.slug]);

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
    const success = await dispatch(createPendingSignup(quotaId));
    if (!success) {
      toast.error('Ilmoittautuminen epäonnistui.', {
        autoClose: 5000,
      });
    }
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
            {event.category && (
              <p>
                <strong>Kategoria:</strong>
                {' '}
                {event.category}
              </p>
            )}
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
          <div className="event-description">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {event.description || ''}
            </ReactMarkdown>
          </div>
        </div>
        <div className="col-xs-12 col-sm-4 pull-right">
          <SignupCountdown beginSignup={beginSignup} />
          <QuotaStatus signups={signupsByQuota} />
        </div>
      </div>
      {event.signupsPublic && (
        <div className="event-signups">
          <h2>Ilmoittautuneet</h2>
          {signupsByQuota.map((quota) => (
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

export default SingleEvent;
