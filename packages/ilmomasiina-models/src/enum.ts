/** Possible statuses for a signup. */
export enum SignupStatus {
  IN_QUOTA = 'in-quota',
  IN_OPEN_QUOTA = 'in-open',
  IN_QUEUE = 'in-queue',
}

/** Possible question types. */
export enum QuestionType {
  TEXT = 'text',
  TEXT_AREA = 'textarea',
  NUMBER = 'number',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
}

/** Event types that can be audit logged. */
export enum AuditEvent {
  CREATE_EVENT = 'event.create',
  DELETE_EVENT = 'event.delete',
  PUBLISH_EVENT = 'event.publish',
  UNPUBLISH_EVENT = 'event.unpublish',
  EDIT_EVENT = 'event.edit',
  PROMOTE_SIGNUP = 'signup.queuePromote',
  DELETE_SIGNUP = 'signup.delete',
  EDIT_SIGNUP = 'signup.edit',
  CREATE_USER = 'user.create',
  DELETE_USER = 'user.delete',
  RESET_PASSWORD = 'user.resetpassword',
  CHANGE_PASSWORD = 'user.changepassword',
}
