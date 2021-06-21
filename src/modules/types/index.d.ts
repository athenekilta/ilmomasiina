type ApiId = number;

interface SequelizeType {
  id: ApiId;
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
}

export interface Answer extends SequelizeType {
  answer: string;
  questionId: Question['id'];
}

export interface Event extends SequelizeType {
  title: string;
  date: string;
  webpageUrl: string;
  facebookUrl: string;
  location: string;
  price: string;
  description: string;
  signupsPublic: boolean;

  registrationStartDate: string;
  registrationEndDate: string;
  quota: Quota[];
  openQuotaSize: number;

  questions: Question[];

  verificationEmail: string;

  draft: boolean;

  registrationClosed: boolean;
  millisTillOpening: number;
}

export interface Quota extends SequelizeType {
  title: string;
  size: number;
  signups: Signup[];
  signupCount: number;
}

export interface Question extends SequelizeType {
  eventId: Event['id'];
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox';
  question: string;
  options: string[] | null;
  public: boolean;
  required: boolean;
}

export interface Signup extends SequelizeType {
  answers: Answer[];
  confirmedAt: string;
  editToken: string;
  email: string;
  firstName: string;
  lastName: string;
  position: number;
  quota: Quota;
  quotaId: Quota['id'];
  status: string;
}
