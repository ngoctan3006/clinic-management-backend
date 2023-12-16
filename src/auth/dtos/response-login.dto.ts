import { UserWithoutPassword } from '.';

export interface ResponseLoginDto {
  accessToken: string;
  refreshToken: string;
  user: UserWithoutPassword;
}
