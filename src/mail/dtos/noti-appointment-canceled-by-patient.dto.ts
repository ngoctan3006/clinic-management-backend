import { NotiAppointmentCreatedDto } from '.';

export class NotiAppointmentCanceledByPatientDto extends NotiAppointmentCreatedDto {
  reason: string;
}
