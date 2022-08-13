/* eslint-disable max-classes-per-file */
import * as schema from '@tietokilta/ilmomasiina-models/src/schema';

export abstract class CustomError extends Error {
  public readonly statusCode: number;
  public readonly error: string;

  protected constructor(statusCode: number, name: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.error = name;
  }
}

export class EditConflict extends CustomError implements schema.EditConflictErrorSchema {
  public readonly updatedAt: string; // in date-time format
  public readonly deletedQuotas: schema.SignupQuotaID[];
  public readonly deletedQuestions: schema.SignupQuestionID[];

  constructor(updatedAt: Date, deletedQuotas: schema.SignupQuotaID[], deletedQuestions: schema.SignupQuestionID[]) {
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

export class WouldMoveSignupsToQueue extends CustomError implements schema.WouldMoveSignupsToQueue {
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
