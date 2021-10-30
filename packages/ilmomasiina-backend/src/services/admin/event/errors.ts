/* eslint-disable max-classes-per-file */
import { FeathersError } from '@feathersjs/errors';

import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';

export class EditConflict extends FeathersError {
  constructor(deletedQuotas: Quota['id'][], deletedQuestions: Question['id'][]) {
    super(
      `${deletedQuestions.length} question IDs and ${deletedQuotas.length} quota IDs don't exist`,
      'EditConflict',
      409,
      'edit-conflict',
      { deletedQuotas, deletedQuestions },
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
