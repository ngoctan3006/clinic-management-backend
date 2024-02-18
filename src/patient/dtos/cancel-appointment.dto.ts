import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelAppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reason: string;
}
