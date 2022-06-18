import QuestionAttributes from '../../models/question';
import SignupAttributes from '../../models/signup';

// Expected request schema.
export interface SignupUpdateBodyAnswer {
  questionId: QuestionAttributes['id'];
  answer: string;
}

export interface SignupUpdateBody {
  firstName: string;
  lastName: string;
  namePublic: boolean;
  email: string;
  answers: SignupUpdateBodyAnswer[];
  editToken?: string;
}

// Response schema.
export interface SignupUpdateResponse {
  id: SignupAttributes['id'];
  confirmedAt: Date;
}
