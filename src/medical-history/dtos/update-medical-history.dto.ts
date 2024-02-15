import { PartialType } from '@nestjs/swagger';
import { CreateMedicalHistoryDto } from '.';

export class UpdateMedicalHistoryDto extends PartialType(
  CreateMedicalHistoryDto,
) {}
