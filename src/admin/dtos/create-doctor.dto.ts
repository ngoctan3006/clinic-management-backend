import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SignupDto } from 'src/auth/dtos';

export class CreateDoctorDto extends OmitType(SignupDto, [
  'password',
  'confirmPassword',
] as const) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  speciality: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  degree: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  experience: string;
}
