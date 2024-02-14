import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MedicalService, Role } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards';
import { Roles } from 'src/common/decorators';
import { CreateMedicalServiceDto, UpdateMedicalServiceDto } from './dtos';
import { MedicalServiceService } from './medical-service.service';

@ApiTags('medical-service')
@ApiBearerAuth()
@Controller('medical-service')
export class MedicalServiceController {
  constructor(private readonly medicalServiceService: MedicalServiceService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllServices(): Promise<MedicalService[]> {
    return this.medicalServiceService.getAllServices();
  }

  @Roles(Role.ADMIN)
  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Post()
  async createMedicalService(
    @Body() data: CreateMedicalServiceDto,
  ): Promise<MedicalService> {
    return this.medicalServiceService.createMedicalService(data);
  }

  @Roles(Role.ADMIN)
  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Put(':id')
  async updateMedicalService(
    @Param('id') id: number,
    @Body() data: UpdateMedicalServiceDto,
  ): Promise<MedicalService> {
    return this.medicalServiceService.updateMedicalService(id, data);
  }
}
