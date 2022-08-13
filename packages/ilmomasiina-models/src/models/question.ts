import EventAttributes from './event';

export enum QuestionType {
  Text = 'text',
  TextArea = 'textarea',
  Number = 'number',
  Select = 'select',
  Checkbox = 'checkbox',
}

export default interface QuestionAttributes {
  id: string;
  order: number;
  question: string;
  type: QuestionType;
  options: string | null;
  required: boolean;
  public: boolean;
  eventId: EventAttributes['id'];
}
