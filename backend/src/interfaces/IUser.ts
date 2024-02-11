export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  profile_picture: string;
  refreshToken?: string;
  role: string;
}
