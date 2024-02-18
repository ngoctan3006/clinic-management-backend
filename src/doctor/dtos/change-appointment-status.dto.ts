import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum DoctorChangeStatus {
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED_BY_DOCTOR = 'CANCELED_BY_DOCTOR',
}

export class ChangeAppointmentStatusDto {
  @ApiProperty({
    enum: DoctorChangeStatus,
    example: DoctorChangeStatus.IN_PROGRESS,
  })
  @IsNotEmpty()
  @IsString()
  status: DoctorChangeStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason: string;
}
