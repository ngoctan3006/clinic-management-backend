import { PartialType } from '@nestjs/swagger';
import { CreateMedicalServiceDto } from '.';

export class UpdateMedicalServiceDto extends PartialType(
  CreateMedicalServiceDto,
) {}
