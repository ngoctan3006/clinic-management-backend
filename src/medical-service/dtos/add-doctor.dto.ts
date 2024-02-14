import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { transformToInt } from 'src/common/utils';

export class AddDoctorServiceDto {
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
