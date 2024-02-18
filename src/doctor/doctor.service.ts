import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Appointment,
  AppointmentStatus,
  MedicalHistory,
  Role,
} from '@prisma/client';
import { IQuery, IResponse } from 'src/common/dtos';
import { MailQueueService } from 'src/mail/services';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangeAppointmentStatusDto, DoctorChangeStatus } from './dtos';
import * as moment from 'moment';

@Injectable()
export class DoctorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailQueueService: MailQueueService,
  ) {}

  async getAllAppointments(
    userId: number,
    query: IQuery,
  ): Promise<IResponse<Appointment[]>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, role: Role.DOCTOR },
      include: { doctor: true },
    });
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    const doctorId = user.doctor.id;
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.prisma.appointment.count();
    const data = await this.prisma.appointment.findMany({
      where: { doctorId },
      skip,
      take: pageSize,
      include: {
        doctor: {
          select: {
            id: true,
            degree: true,
            speciality: true,
            experience: true,
            user: {
              select: {
                id: true,
                phone: true,
                fullname: true,
                email: true,
                address: true,
                birthday: true,
                gender: true,
              },
            },
          },
        },
        patient: {
          select: {
            id: true,
            phone: true,
            fullname: true,
            email: true,
            address: true,
            birthday: true,
            gender: true,
          },
        },
        service: true,
      },
    });
    return {
      success: true,
      message: 'Get all appointments success',
      data,
      pagination: {
        page,
        pageSize,
        total,
      },
    };
  }

  async getAllMedicalHistory(
    userId: number,
    query: IQuery,
  ): Promise<IResponse<MedicalHistory[]>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, role: Role.DOCTOR },
      include: { doctor: true },
    });
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    const doctorId = user.doctor.id;
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.prisma.medicalHistory.count({
      where: { doctorId, deletedAt: null },
    });
    const data = await this.prisma.medicalHistory.findMany({
      where: { doctorId, deletedAt: null },
      skip,
      take: pageSize,
      include: {
        doctor: {
          select: {
            id: true,
            degree: true,
            speciality: true,
            experience: true,
            user: {
              select: {
                id: true,
                phone: true,
                fullname: true,
                email: true,
                address: true,
                birthday: true,
                gender: true,
              },
            },
          },
        },
        patient: {
          select: {
            id: true,
            phone: true,
            fullname: true,
            email: true,
            address: true,
            birthday: true,
            gender: true,
          },
        },
      },
    });
    return {
      success: true,
      message: 'Get all medical history success',
      data,
      pagination: {
        page,
        pageSize,
        total,
      },
    };
  }

  async changeAppointmentStatus(
    id: number,
    data: ChangeAppointmentStatusDto,
  ): Promise<Appointment> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id, deletedAt: null },
      include: {
        doctor: {
          select: {
            user: {
              select: {
                fullname: true,
              },
            },
          },
        },
        patient: {
          select: {
            fullname: true,
            email: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!appointment) {
      throw new NotFoundException({
        success: false,
        message: 'Appointment not found',
        data: null,
      });
    }
    const { status, reason } = data;
    switch (appointment.status) {
      case AppointmentStatus.PENDING:
        if (status === DoctorChangeStatus.CONFIRMED) {
          await this.prisma.appointment.update({
            where: { id },
            data: {
              status: AppointmentStatus.CONFIRMED,
            },
          });
          await this.mailQueueService.addNotiAppointmentConfirmedMail({
            to: appointment.patient.email,
            fullname: appointment.patient.fullname,
            time: moment(appointment.startTime).format('HH:mm'),
            date: moment(appointment.startTime).format('DD/MM/YYYY'),
            serviceName: appointment.service.name,
            doctorName: appointment.doctor.user.fullname,
          });
        } else if (status === AppointmentStatus.CANCELED_BY_DOCTOR) {
          if (!reason) {
            throw new BadRequestException({
              success: false,
              message: 'Reason is missing',
              data: null,
            });
          }
          await this.prisma.appointment.update({
            where: { id },
            data: {
              status: AppointmentStatus.CANCELED_BY_DOCTOR,
              reasonCanceled: reason,
            },
          });
          await this.mailQueueService.addNotiAppointmentCanceledByDoctorMail({
            to: appointment.patient.email,
            fullname: appointment.patient.fullname,
            time: moment(appointment.startTime).format('HH:mm'),
            date: moment(appointment.startTime).format('DD/MM/YYYY'),
            serviceName: appointment.service.name,
            doctorName: appointment.doctor.user.fullname,
            reason,
          });
        } else {
          throw new BadRequestException({
            success: false,
            message: 'Invalid status',
            data: null,
          });
        }
        break;
      case AppointmentStatus.CONFIRMED:
        if (status === DoctorChangeStatus.IN_PROGRESS) {
          await this.prisma.appointment.update({
            where: { id },
            data: {
              status: AppointmentStatus.IN_PROGRESS,
            },
          });
        } else if (status === AppointmentStatus.CANCELED_BY_DOCTOR) {
          if (!reason) {
            throw new BadRequestException({
              success: false,
              message: 'Reason is missing',
              data: null,
            });
          }
          await this.prisma.appointment.update({
            where: { id },
            data: {
              status: AppointmentStatus.CANCELED_BY_DOCTOR,
              reasonCanceled: reason,
            },
          });
          await this.mailQueueService.addNotiAppointmentCanceledByDoctorMail({
            to: appointment.patient.email,
            fullname: appointment.patient.fullname,
            time: moment(appointment.startTime).format('HH:mm'),
            date: moment(appointment.startTime).format('DD/MM/YYYY'),
            serviceName: appointment.service.name,
            doctorName: appointment.doctor.user.fullname,
            reason,
          });
        } else {
          throw new BadRequestException({
            success: false,
            message: 'Invalid status',
            data: null,
          });
        }
        break;
      case AppointmentStatus.IN_PROGRESS:
        if (status === DoctorChangeStatus.COMPLETED) {
          await this.prisma.appointment.update({
            where: { id },
            data: {
              status: AppointmentStatus.COMPLETED,
            },
          });
        } else {
          throw new BadRequestException({
            success: false,
            message: 'Invalid status',
            data: null,
          });
        }
        break;
      default:
        throw new BadRequestException({
          success: false,
          message: 'Invalid status',
          data: null,
        });
    }
    return await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            id: true,
            degree: true,
            speciality: true,
            experience: true,
            user: {
              select: {
                id: true,
                phone: true,
                fullname: true,
                email: true,
                address: true,
                birthday: true,
                gender: true,
              },
            },
          },
        },
        patient: {
          select: {
            id: true,
            phone: true,
            fullname: true,
            email: true,
            address: true,
            birthday: true,
            gender: true,
          },
        },
        service: true,
      },
    });
  }

  async deleteMedicalHistory(
    id: number,
    userId: number,
  ): Promise<MedicalHistory> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, role: Role.DOCTOR },
      include: { doctor: true },
    });
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    const doctorId = user.doctor.id;
    const medicalHistory = await this.prisma.medicalHistory.findUnique({
      where: { id, doctorId, deletedAt: null },
    });
    if (!medicalHistory) {
      throw new NotFoundException({
        success: false,
        message: 'Medical history not found',
        data: null,
      });
    }
    return await this.prisma.medicalHistory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restoreMedicalHistory(
    id: number,
    userId: number,
  ): Promise<MedicalHistory> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, role: Role.DOCTOR },
      include: { doctor: true },
    });
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    const doctorId = user.doctor.id;
    const medicalHistory = await this.prisma.medicalHistory.findUnique({
      where: { id, doctorId, deletedAt: { not: null } },
    });
    if (!medicalHistory) {
      throw new NotFoundException({
        success: false,
        message: 'Medical history not found',
        data: null,
      });
    }
    await this.prisma.medicalHistory.update({
      where: { id },
      data: { deletedAt: null },
    });
    return await this.prisma.medicalHistory.findUnique({
      where: { id, deletedAt: null },
      include: {
        doctor: {
          select: {
            id: true,
            degree: true,
            speciality: true,
            experience: true,
            user: {
              select: {
                id: true,
                phone: true,
                fullname: true,
                email: true,
                address: true,
                birthday: true,
                gender: true,
              },
            },
          },
        },
        patient: {
          select: {
            id: true,
            phone: true,
            fullname: true,
            email: true,
            address: true,
            birthday: true,
            gender: true,
          },
        },
      },
    });
  }
}
