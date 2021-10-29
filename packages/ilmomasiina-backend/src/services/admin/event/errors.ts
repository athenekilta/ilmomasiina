/* eslint-disable max-classes-per-file */
import { FeathersError } from '@feathersjs/errors';

import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';

export class QuotaDeleted extends FeathersError {
  constructor(quotaId: Quota['id']) {
    super(
      `quota ${quotaId} was deleted`,
      'QuotaDeleted',
      409,
      'quota-deleted',
      {},
    );
  }
}

export class QuestionDeleted extends FeathersError {
  constructor(questionId: Question['id']) {
    super(
      `question ${questionId} was deleted`,
      'QuestionDeleted',
      409,
      'question-deleted',
      {},
    );
  }
}

export class WouldMoveSignupsToQueue extends FeathersError {
  constructor(count: number) {
    super(
      `this change would move ${count} signups into the queue`,
      'WouldMoveSignupsToQueue',
      409,
      'would-move-signups-to-queue',
      { count },
    );
  }
}
