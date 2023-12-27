import { OmitType } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { SignupDto } from 'src/auth/dtos';

export class CreateUserDto extends OmitType(SignupDto, [
  'confirmPassword',
] as const) {
  role?: Role = Role.PATIENT;
}
