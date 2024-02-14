import { Module } from '@nestjs/common';
import { MedicalServiceController } from './medical-service.controller';
import { MedicalServiceService } from './medical-service.service';

@Module({
  controllers: [MedicalServiceController],
  providers: [MedicalServiceService],
})
export class MedicalServiceModule {}
