import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { MedicalHistory, Role } from '@prisma/client';
import { CurrentUser, Roles } from 'src/common/decorators';
import { IResponse } from 'src/common/dtos';
import { CreateMedicalHistoryDto, UpdateMedicalHistoryDto } from './dtos';
import { MedicalHistoryService } from './medical-history.service';

@ApiTags('medical-history')
@Controller('medical-history')
@ApiBearerAuth()
export class MedicalHistoryController {
  constructor(private readonly medicalHistoryService: MedicalHistoryService) {}

  @Roles(Role.DOCTOR)
  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @Post()
  async createMedicalHistory(
    @CurrentUser('id') id: number,
    @Body() data: CreateMedicalHistoryDto,
  ): Promise<IResponse<MedicalHistory>> {
    return {
      success: true,
      message: 'Create medical history successfully',
      data: await this.medicalHistoryService.createMedicalHistory(+id, data),
    };
  }

  @Roles(Role.DOCTOR)
  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @ApiParam({ name: 'id', description: 'Medical history id' })
  @Put(':id')
  async updateMedicalHistory(
    @CurrentUser('id') userId: number,
    @Param('id') id: number,
    @Body() data: UpdateMedicalHistoryDto,
  ): Promise<IResponse<MedicalHistory>> {
    return {
      success: true,
      message: 'Update medical history successfully',
      data: await this.medicalHistoryService.updateMedicalHistory(
        +id,
        userId,
        data,
      ),
    };
  }
}
