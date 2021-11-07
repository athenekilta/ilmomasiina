export default interface EventAttributes {
  id: string;
  title: string;
  slug: string;
  date: Date | null;
  registrationStartDate: Date | null;
  registrationEndDate: Date | null;
  openQuotaSize: number;
  description: string | null;
  price: string | null;
  location: string | null;
  facebookUrl: string | null;
  webpageUrl: string | null;
  draft: boolean;
  listed: boolean;
  signupsPublic: boolean;
  verificationEmail: string | null;
  updatedAt: Date;
}
