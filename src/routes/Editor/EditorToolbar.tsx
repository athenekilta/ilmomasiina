import React from 'react';

import { Spinner } from '@theme-ui/components';
import { useFormikContext } from 'formik';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { EditorEvent } from '../../modules/editor/types';

import './Editor.scss';

interface EditorToolbarProps {
  event: EditorEvent;
  isNew: boolean;
}

type Props = EditorToolbarProps & RouteComponentProps<{ id: string }>;

const EditorToolbar = (props: Props) => {
  const { event, isNew } = props;
  const { isSubmitting } = useFormikContext<EditorEvent>();

  // TODO: fix submit buttons

  return (
    <>
      <Link to={`${PREFIX_URL}/admin`}>&#8592; Takaisin</Link>
      <h1>
        {isNew
          ? 'Luo uusi tapahtuma'
          : 'Muokkaa tapahtumaa'}
      </h1>
      <div className="pull-right event-editor--buttons-wrapper">
        {isSubmitting && <Spinner />}
        {!isNew && (
          <>
            <div className="event-editor--public-status">
              <div className="event-editor--bubble draft event-editor--animated" />
              <span>Luonnos</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={
                event.draft
                  ? 'btn btn-success event-editor--animated'
                  : 'btn btn-warning event-editor--animated'
              }
              formNoValidate
            >
              {event.draft ? 'Julkaise' : 'Muuta luonnokseksi'}
            </button>
          </>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-info event-editor--animated"
          formNoValidate
        >
          {isNew ? 'Tallenna luonnoksena' : 'Tallenna muutokset'}
        </button>
      </div>
    </>
  );
};

export default withRouter(EditorToolbar);
