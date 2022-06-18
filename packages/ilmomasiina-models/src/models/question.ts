import EventAttributes from './event';

export const questionTypes = ['text', 'textarea', 'number', 'select', 'checkbox'] as const;
export type QuestionType = typeof questionTypes[number];

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
