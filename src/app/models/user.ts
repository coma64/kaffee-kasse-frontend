export interface User {
  id: number;
  username: string;
  is_staff: boolean;
  date_joined: Date;
  profile: string;
  password?: string;
}
