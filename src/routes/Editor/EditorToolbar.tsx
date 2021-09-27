import React from 'react';

import { useFormikContext } from 'formik';
import { Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { shallowEqual } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { EditorEvent } from '../../modules/editor/types';
import { useTypedSelector } from '../../store/reducers';

import './Editor.scss';

interface EditorToolbarProps {
  onSubmitClick: (asDraft: boolean) => void;
}

type Props = EditorToolbarProps & RouteComponentProps<{ id: string }>;

const EditorToolbar = ({ onSubmitClick }: Props) => {
  const { isSubmitting } = useFormikContext<EditorEvent>();
  const { event, isNew } = useTypedSelector((state) => state.editor, shallowEqual);

  const isDraft = event?.draft || isNew;

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
          <div className={`event-editor--bubble ${isDraft ? 'draft' : 'public'} event-editor--animated`} />
          <span>{isDraft ? 'Luonnos' : 'Julkaistu'}</span>
        </div>
        <ButtonGroup>
          {!isNew && (
            <Button
              type="button"
              disabled={isSubmitting}
              variant={isDraft ? 'success' : 'warning'}
              formNoValidate
              onClick={() => onSubmitClick(!isDraft)}
            >
              {isDraft ? 'Julkaise' : 'Muuta luonnokseksi'}
            </Button>
          )}
          <Button
            type="button"
            disabled={isSubmitting}
            variant="secondary"
            formNoValidate
            onClick={() => onSubmitClick(isDraft)}
          >
            {isNew ? 'Tallenna luonnoksena' : 'Tallenna muutokset'}
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
};

export default withRouter(EditorToolbar);
