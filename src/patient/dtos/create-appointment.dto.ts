import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { transformToDate, transformToInt } from 'src/common/utils';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'ISO Date String Format' })
  @Transform(transformToDate)
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty()
  @Transform(transformToInt)
  @IsNotEmpty()
  @IsInt()
  doctorId: number;

  @ApiProperty()
  @Transform(transformToInt)
  @IsNotEmpty()
  @IsInt()
  serviceId: number;
}
