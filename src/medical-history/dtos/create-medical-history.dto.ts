import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { transformToDate, transformToInt } from 'src/common/utils';

export class CreateMedicalHistoryDto {
  @ApiProperty()
  @Transform(transformToInt)
  @IsNotEmpty()
  @IsInt()
  patientId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  symptons: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  diagnosis: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  treatment: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  prescription: string;

  @ApiProperty({ description: 'ISO Date String Format' })
  @Transform(transformToDate)
  @IsNotEmpty()
  admissionDate: Date;

  @ApiProperty({ description: 'ISO Date String Format' })
  @Transform(transformToDate)
  @IsNotEmpty()
  dischargeDate: Date;
}
