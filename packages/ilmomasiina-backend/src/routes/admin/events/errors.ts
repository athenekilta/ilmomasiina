/* eslint-disable max-classes-per-file */
import type {
  EditConflictError, QuestionID, QuotaID, WouldMoveSignupsToQueueError,
} from '@tietokilta/ilmomasiina-models';

export abstract class CustomError extends Error {
  public readonly statusCode: number;
  public readonly error: string;

  protected constructor(statusCode: number, name: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.error = name;
  }
}

export class EditConflict extends CustomError implements EditConflictError {
  public readonly updatedAt: string; // in date-time format
  public readonly deletedQuotas: QuotaID[];
  public readonly deletedQuestions: QuestionID[];

  constructor(updatedAt: Date, deletedQuotas: QuotaID[], deletedQuestions: QuestionID[]) {
    const updatedAtStr = updatedAt.toISOString();
    super(
      409,
      'EditConflict',
      `the event was updated separately at ${updatedAtStr}`,
    );
    this.updatedAt = updatedAtStr;
    this.deletedQuotas = deletedQuotas;
    this.deletedQuestions = deletedQuestions;
  }
}

export class WouldMoveSignupsToQueue extends CustomError implements WouldMoveSignupsToQueueError {
  public readonly count: number;

  constructor(count: number) {
    super(
      409,
      'WouldMoveSignupsToQueue',
      `this change would move ${count} signups into the queue`,
    );
    this.count = count;
  }
}
