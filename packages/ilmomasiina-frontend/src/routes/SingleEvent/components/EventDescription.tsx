import React from 'react';

import moment from 'moment';
import { Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

import paths from '../../../paths';
import { useTypedSelector } from '../../../store/reducers';
import { useSingleEventContext } from '../state';

const EventDescription = () => {
  const event = useSingleEventContext().event!;
  const loggedIn = useTypedSelector((state) => state.auth.loggedIn);
  return (
    <>
      <nav className="title-nav">
        <h1>{event.title}</h1>
        {loggedIn && (
          <Button as={Link} variant="primary" to={paths.adminEditEvent(event.id)} className="ml-2">
            Muokkaa
          </Button>
        )}
      </nav>
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
            <strong>{event.endDate ? 'Alkaa:' : 'Ajankohta:'}</strong>
            {' '}
            {moment(event.date).format('D.M.Y [klo] HH:mm')}
          </p>
        )}
        {event.endDate && (
          <p>
            <strong>Loppuu:</strong>
            {' '}
            {moment(event.endDate).format('D.M.Y [klo] HH:mm')}
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
    </>
  );
};

export default EventDescription;
