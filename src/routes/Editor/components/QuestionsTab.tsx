import React from 'react';

import _ from 'lodash';

import { updateEventField } from '../../../modules/editor/actions';
import { Event } from '../../../modules/types';
import { useTypedDispatch } from '../../../store/reducers';
import Questions from './Questions';

type Props = {
  event: Event;
};

const QuestionsTab = (props: Props) => {
  const { event } = props;
  const dispatch = useTypedDispatch();

  function addQuestion() {
    const questions = event.questions ? event.questions : [];

    const newQuestions = _.concat(questions, {
      id: (_.max(questions.map(q => q.id)) || 0) + 1,
      order: (_.max(questions.map(q => q.order)) || 0) + 1,
      existsInDb: false,
      required: false,
      public: false,
      question: '',
      type: 'text'
    });

    dispatch(updateEventField('questions', newQuestions));
  }

  return (
    <div>
      <p>Kaikilta osallistujilta kerätään aina nimi ja sähköpostiosoite.</p>
      <div>
        <Questions {...props} />
        <a className="btn btn-primary pull-right" onClick={addQuestion}>
          Lisää kysymys
        </a>
      </div>
    </div>
  );
};

export default QuestionsTab;
