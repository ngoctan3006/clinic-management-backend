import { Role } from '@prisma/client';

export class JwtPayload {
  id: number;
  username: string;
  position: Role;
  iat?: number;
  exp?: number;
}
