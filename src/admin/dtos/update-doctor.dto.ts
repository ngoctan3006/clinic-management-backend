import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { transformValue } from 'src/common/utils';

export class UpdateDoctorDto {
  @ApiProperty({ required: false })
  @Transform(transformValue)
  @IsOptional()
  @IsString()
  speciality: string;

  @ApiProperty({ required: false })
  @Transform(transformValue)
  @IsOptional()
  @IsString()
  degree: string;

  @ApiProperty({ required: false })
  @Transform(transformValue)
  @IsOptional()
  @IsString()
  experience: string;
}
