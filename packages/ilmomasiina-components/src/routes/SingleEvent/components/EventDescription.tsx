import React, { useContext } from 'react';

import moment from 'moment-timezone';
import { Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { timezone } from '../../../config';
import { paths } from '../../../config/paths';
import { linkComponent } from '../../../config/router';
import AuthContext from '../../../contexts/auth';
import { useSingleEventContext } from '../../../modules/singleEvent';

const EventDescription = () => {
  const event = useSingleEventContext().event!;
  const { loggedIn } = useContext(AuthContext);
  const adminPaths = paths();
  const Link = linkComponent();
  return (
    <>
      <nav className="ilmo--title-nav">
        <h1>{event.title}</h1>
        {loggedIn && adminPaths.hasAdmin && (
          <Button as={Link} variant="primary" to={adminPaths.adminEditEvent(event.id)}>
            Muokkaa
          </Button>
        )}
      </nav>
      <div className="ilmo--event-heading">
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
            {moment(event.date).tz(timezone()).format('D.M.Y [klo] HH:mm')}
          </p>
        )}
        {event.endDate && (
          <p>
            <strong>Loppuu:</strong>
            {' '}
            {moment(event.endDate).tz(timezone()).format('D.M.Y [klo] HH:mm')}
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
      <div className="ilmo--event-description">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {event.description || ''}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default EventDescription;
