import React from 'react';

import { Spinner } from '@theme-ui/components';
import { useFormikContext } from 'formik';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { FormEvent } from './Editor';

import './Editor.scss';

interface EditorToolbarProps {
  event: FormEvent;
  isNew: boolean;
}

type Props = EditorToolbarProps & RouteComponentProps<{ id: string }>;

const EditorToolbar = (props: Props) => {
  const { event, isNew } = props;
  const { isSubmitting } = useFormikContext<FormEvent>();

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
            <input
              type="submit"
              disabled={isSubmitting}
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
          disabled={isSubmitting}
          className="btn btn-info event-editor--animated"
          formNoValidate
          value={isNew ? 'Tallenna luonnoksena' : 'Tallenna muutokset'}
        />
      </div>
    </>
  );
};

export default withRouter(EditorToolbar);
