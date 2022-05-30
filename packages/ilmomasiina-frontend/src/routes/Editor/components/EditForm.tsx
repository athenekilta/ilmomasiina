import React, { RefObject, useState } from 'react';

import { FormikProps } from 'formik';
import { Form } from 'react-bootstrap';

import { EditorEvent } from '../../../modules/editor/types';
import { EditorSubmitOptions } from '..';
import BasicDetailsTab from './BasicDetailsTab';
import EditConflictModal from './EditConflictModal';
import EditorTabBody from './EditorTabBody';
import EditorTabHeader, { EditorTab } from './EditorTabHeader';
import EditorToolbar from './EditorToolbar';
import EmailsTab from './EmailsTab';
import MoveToQueueWarning from './MoveToQueueWarning';
import QuestionsTab from './QuestionsTab';
import QuotasTab from './QuotasTab';
import SignupsTab from './SignupsTab';

type Props = FormikProps<EditorEvent> & {
  submitOptions: RefObject<EditorSubmitOptions>;
};

const EditForm = ({ handleSubmit, submitForm, submitOptions }: Props) => {
  const [activeTab, setActiveTab] = useState<EditorTab>(EditorTab.BASIC_DETAILS);

  function onSubmitClick(asDraft: boolean) {
    // eslint-disable-next-line no-param-reassign
    submitOptions.current!.saveAsDraft = asDraft;
    submitForm();
  }

  function onMoveToQueueProceed() {
    // eslint-disable-next-line no-param-reassign
    submitOptions.current!.allowMoveToQueue = true;
    submitForm();
  }

  return (
    <>
      <Form onSubmit={handleSubmit} role="tablist">
        <EditorToolbar onSubmitClick={onSubmitClick} />
        <EditorTabHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="tab-content mt-4">
          <EditorTabBody id={EditorTab.BASIC_DETAILS} activeTab={activeTab} component={BasicDetailsTab} />
          <EditorTabBody id={EditorTab.QUOTAS} activeTab={activeTab} component={QuotasTab} />
          <EditorTabBody id={EditorTab.QUESTIONS} activeTab={activeTab} component={QuestionsTab} />
          <EditorTabBody id={EditorTab.EMAILS} activeTab={activeTab} component={EmailsTab} />
          <EditorTabBody id={EditorTab.SIGNUPS} activeTab={activeTab} component={SignupsTab} />
        </div>
      </Form>
      <MoveToQueueWarning onProceed={onMoveToQueueProceed} />
      <EditConflictModal />
    </>
  );
};

export default EditForm;
