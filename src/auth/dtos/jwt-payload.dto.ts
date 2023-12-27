import { Role } from '@prisma/client';

export class JwtPayload {
  id: number;
  phone: string;
  role: Role;
  iat?: number;
  exp?: number;
}
