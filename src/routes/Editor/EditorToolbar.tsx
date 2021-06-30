import React from 'react';

import { useFormikContext } from 'formik';
import { Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { EditorEvent } from '../../modules/editor/types';

import './Editor.scss';

interface EditorToolbarProps {
  isNew: boolean;
}

type Props = EditorToolbarProps & RouteComponentProps<{ id: string }>;

const EditorToolbar = ({ isNew }: Props) => {
  const { isSubmitting, values: { draft } } = useFormikContext<EditorEvent>();

  // TODO: fix submit buttons

  return (
    <>
      <nav className="d-flex justify-content-end">
        <Link to={`${PREFIX_URL}/admin`}>&#8592; Takaisin</Link>
      </nav>
      <h1>
        {isNew
          ? 'Luo uusi tapahtuma'
          : 'Muokkaa tapahtumaa'}
      </h1>
      <div className="event-editor--buttons-wrapper">
        {isSubmitting && <Spinner animation="border" />}
        <div className="event-editor--public-status">
          <div className={`event-editor--bubble ${draft ? 'draft' : 'public'} event-editor--animated`} />
          <span>{draft ? 'Luonnos' : 'Julkaistu'}</span>
        </div>
        <ButtonGroup>
          {!isNew && (
            <Button
              type="submit"
              disabled={isSubmitting}
              variant={draft ? 'success' : 'warning'}
              formNoValidate
            >
              {draft ? 'Julkaise' : 'Muuta luonnokseksi'}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="secondary"
            formNoValidate
          >
            {isNew ? 'Tallenna luonnoksena' : 'Tallenna muutokset'}
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
};

export default withRouter(EditorToolbar);
