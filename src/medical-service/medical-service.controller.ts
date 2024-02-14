import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MedicalService } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards';
import { MedicalServiceService } from './medical-service.service';

@ApiTags('medical-service')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('medical-service')
export class MedicalServiceController {
  constructor(private readonly medicalServiceService: MedicalServiceService) {}

  @Get()
  async getAllServices(): Promise<MedicalService[]> {
    return this.medicalServiceService.getAllServices();
  }
}
