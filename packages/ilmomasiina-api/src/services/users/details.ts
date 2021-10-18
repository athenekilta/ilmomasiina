import UserAttributes from '../../models/user';

// Request schema for user creation.
export interface UserCreateBody {
  email: string;
}

// Attributes returned for User instances.
export const userGetAttributes = ['id', 'email'] as const;

// Response schema for user requests.
export interface UserDetails extends Pick<UserAttributes, typeof userGetAttributes[number]> {}

export type UserListItem = UserDetails;

export type UserListResponse = UserListItem[];
