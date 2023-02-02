import { QuestionType } from '../enum';
import EventAttributes from './event';

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
