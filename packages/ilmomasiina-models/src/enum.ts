export enum SignupStatus {
  IN_QUOTA = 'in-quota',
  IN_OPEN_QUOTA = 'in-open',
  IN_QUEUE = 'in-queue',
}

export enum QuestionType {
  Text = 'text',
  TextArea = 'textarea',
  Number = 'number',
  Select = 'select',
  Checkbox = 'checkbox',
}

/** Describes all possible actions that can be logged into audit log */
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
}
