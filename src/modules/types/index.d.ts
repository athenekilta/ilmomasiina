interface SequelizeType {
  id: string;
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
}

export interface Answer extends SequelizeType {
  answer: string;
}

export interface Event extends SequelizeType {
  date: string;
  description: string;
  draft: boolean;
  facebook: string;
  facebookUrl: string;
  homepage: string;
  location: string;
  millisTillOpening: number;
  openQuotaSize: number;
  price: string;
  questions: Question[];
  quota: Quota[];
  registrationClosed: boolean;
  registrationStartDate: string;
  registrationEndDate: string;
  signupsPublic: boolean;
  title: string;
  useOpenQuota: boolean;
  verificationEmail: string;
  webpageUrl: string;
}

export interface Quota extends SequelizeType {
  title: string;
  size: number;
}

export interface Question extends SequelizeType {
  eventId: string;
  existsInDb: boolean;
  options: string[];
  public: boolean;
  required: boolean;
  type: string;
  question: string;
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
  quotaId: string;
  status: string;
}

export interface Signup extends SequelizeType {
  email: string;
  password: string;
}
