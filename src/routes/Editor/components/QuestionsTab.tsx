import React from 'react';

import _ from 'lodash';

import { Event } from '../../../modules/types';
import Questions from './Questions';

type Props = {
  event: Event;
  updateEventField: any;
};

const QuestionsTab = (props: Props) => {
  const { event, updateEventField } = props;

  function addQuestion() {
    const questions = event.questions ? event.questions : [];

    const newQuestions = _.concat(questions, {
      id: (_.max(questions.map(n => n.id)) || 0) + 1,
      existsInDb: false,
      required: false,
      public: false,
      question: '',
      type: 'text'
    });

    updateEventField('questions', newQuestions);
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
