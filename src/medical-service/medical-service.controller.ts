import {
  Body,
  Controller,
  Delete,
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
import { IResponse } from 'src/common/dtos';
import { CreateMedicalServiceDto, UpdateMedicalServiceDto } from './dtos';
import { MedicalServiceService } from './medical-service.service';

@ApiTags('medical-service')
@ApiBearerAuth()
@Controller('medical-service')
export class MedicalServiceController {
  constructor(private readonly medicalServiceService: MedicalServiceService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllServices(): Promise<IResponse<MedicalService[]>> {
    return {
      success: true,
      message: 'Get all medical services successfully',
      data: await this.medicalServiceService.getAllServices(),
    };
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
  ): Promise<IResponse<MedicalService>> {
    return {
      success: true,
      message: 'Create medical service successfully',
      data: await this.medicalServiceService.createMedicalService(data),
    };
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
  ): Promise<IResponse<MedicalService>> {
    return {
      success: true,
      message: 'Update medical service successfully',
      data: await this.medicalServiceService.updateMedicalService(id, data),
    };
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteMedicalService(
    @Param('id') id: number,
  ): Promise<IResponse<MedicalService>> {
    return {
      success: true,
      message: 'Delete medical service successfully',
      data: await this.medicalServiceService.deleteMedicalService(id),
    };
  }
}
