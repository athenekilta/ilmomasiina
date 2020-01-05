interface SequelizeType {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Answer extends SequelizeType {
  answer: string;
}

export interface Event extends SequelizeType {
  title: string;
  date: string;
  registrationStartDate: string;
  registrationEndDate: string;
  openQuotaSize: number;
  description: string;
  price: string;
  location: string;
  homepage: string;
  facebookUrl: string;
  webpageUrl: string;
  draft: boolean;
  signupsPublic: boolean;
  verificationEmail: string;
}

export interface Quota extends SequelizeType {
  title: string;
  size: number;
}

export interface Question extends SequelizeType {
  question: string;
  type: string;
  options: string;
  required: boolean;
  public: boolean;
  eventId: string;
}

export interface Signup extends SequelizeType {
  firstName: string;
  lastName: string;
  email: string;
  editToken: string;
  confirmedAt: string;
}

export interface Signup extends SequelizeType {
  email: string;
  password: string;
}
