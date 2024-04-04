export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  profile_picture?: string;
  refreshToken?: string;
  role: string;
}
