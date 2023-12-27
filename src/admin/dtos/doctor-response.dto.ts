import { Doctor } from '@prisma/client';
import { UserWithoutPassword } from 'src/auth/dtos';

export type IDoctor = UserWithoutPassword & {
  doctor: Doctor;
};
