import React from 'react';

import { Spinner } from '@theme-ui/components';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { useTypedSelector } from '../../store/reducers';

import './Editor.scss';

interface EditorToolbarProps {
  publish: (isDraft?: boolean) => void;
}

type Props = EditorToolbarProps & RouteComponentProps;

const EditorToolbar = (props: Props) => {
  const { publish, match } = props;

  const editor = useTypedSelector(state => state.editor);
  const { event, eventPublishLoading } = editor;

  return (
    <>
      <Link to={`${PREFIX_URL}/admin`}>&#8592; Takaisin</Link>
      <h1>
        {match.params.id === 'new'
          ? 'Luo uusi tapahtuma'
          : 'Muokkaa tapahtumaa'}
      </h1>
      <div className="pull-right event-editor--buttons-wrapper">
        {eventPublishLoading && <Spinner />}
        {match.params.id !== 'new' && (
          <>
            <div className="event-editor--public-status">
              <div className="event-editor--bubble draft event-editor--animated" />
              <span>Luonnos</span>
            </div>
            <input
              type="submit"
              disabled={eventPublishLoading}
              className={
                event.draft
                  ? 'btn btn-success event-editor--animated'
                  : 'btn btn-warning event-editor--animated'
              }
              formNoValidate
              value={event.draft ? 'Julkaise' : 'Muuta luonnokseksi'}
            />
          </>
        )}
        <input
          type="submit"
          disabled={eventPublishLoading}
          className="btn btn-info event-editor--animated"
          formNoValidate
          value={
            match.params.id == 'new'
              ? 'Tallenna luonnoksena'
              : 'Tallenna muutokset'
          }
        />
      </div>
    </>
  );
};

export default withRouter(EditorToolbar);
