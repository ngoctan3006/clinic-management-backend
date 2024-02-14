import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeAppointmentStatusDto {
  @ApiProperty({
    enum: AppointmentStatus,
    example: AppointmentStatus.IN_PROGRESS,
  })
  @IsNotEmpty()
  @IsString()
  status: AppointmentStatus;
}
