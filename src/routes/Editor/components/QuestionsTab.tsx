import React from 'react';

import _ from 'lodash';

import { Event } from '../../../modules/types';
import Questions from './Questions';

type Props = {
  event: Event;
  onDataChange: (field: string, value: any) => void;
};

const QuestionsTab = (props: Props) => {
  const { event, onDataChange } = props;

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

    onDataChange('questions', newQuestions);
  }

  return (
    <div>
      <p>Kaikilta osallistujilta kerätään aina nimi ja sähköpostiosoite.</p>
      <div>
        <Questions event={event} onDataChange={onDataChange} />
        <a className="btn btn-primary pull-right" onClick={addQuestion}>
          Lisää kysymys
        </a>
      </div>
    </div>
  );
};

export default QuestionsTab;
