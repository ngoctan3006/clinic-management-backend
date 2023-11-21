import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { SignupDto } from 'src/auth/dtos';

export class CreateUserDto extends SignupDto {
  @ApiProperty({ required: false, enum: Role, default: Role.PATIENT })
  @IsOptional()
  @IsString()
  role: string;
}
