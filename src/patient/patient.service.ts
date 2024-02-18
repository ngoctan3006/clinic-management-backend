import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Appointment,
  AppointmentStatus,
  MedicalHistory,
  Role,
} from '@prisma/client';
import * as moment from 'moment';
import { UserWithoutPassword } from 'src/auth/dtos';
import { IQuery, IResponse } from 'src/common/dtos';
import { MailQueueService } from 'src/mail/services';
import { PrismaService } from 'src/prisma/prisma.service';
import { CancelAppointmentDto, CreateAppointmentDto } from './dtos';

@Injectable()
export class PatientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailQueueService: MailQueueService,
  ) {}

  async getAllDoctor(query: IQuery): Promise<IResponse<UserWithoutPassword[]>> {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.prisma.user.count({
      where: {
        role: Role.DOCTOR,
        doctor: {
          deletedAt: null,
        },
      },
    });
    const data = await this.prisma.user.findMany({
      where: {
        role: Role.DOCTOR,
        doctor: {
          deletedAt: null,
        },
      },
      skip,
      take: pageSize,
      select: {
        id: true,
        phone: true,
        fullname: true,
        email: true,
        address: true,
        birthday: true,
        gender: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        doctor: true,
      },
    });
    return {
      success: true,
      message: 'Get all doctor success',
      data,
      pagination: {
        page,
        pageSize,
        total,
      },
    };
  }

  async createAppointment(
    patientId: number,
    data: CreateAppointmentDto,
  ): Promise<Appointment> {
    const { doctorId, serviceId, startTime } = data;
    const doctor = await this.prisma.user.findFirst({
      where: { role: Role.DOCTOR, doctor: { id: doctorId, deletedAt: null } },
      select: {
        fullname: true,
      },
    });
    if (!doctor) {
      throw new NotFoundException({
        success: false,
        message: 'Doctor not found',
        data: null,
      });
    }
    const patient = await this.prisma.user.findFirst({
      where: { id: patientId, role: Role.PATIENT, deletedAt: null },
      select: {
        fullname: true,
        email: true,
      },
    });
    if (!patient) {
      throw new NotFoundException({
        success: false,
        message: 'Patient not found',
        data: null,
      });
    }
    const service = await this.prisma.medicalService.findUnique({
      where: { id: serviceId, deletedAt: null },
      select: {
        name: true,
      },
    });
    if (!service) {
      throw new NotFoundException({
        success: false,
        message: 'Service not found',
        data: null,
      });
    }
    const endTime = moment(startTime).add(30, 'minutes').toDate();
    const appointment = await this.prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        serviceId,
        startTime,
        endTime,
      },
    });
    await this.mailQueueService.addNotiAppointmentCreatedMail({
      to: patient.email,
      fullname: patient.fullname,
      time: moment(startTime).format('HH:mm'),
      date: moment(startTime).format('DD/MM/YYYY'),
      serviceName: service.name,
      doctorName: doctor.fullname,
    });
    return appointment;
  }

  async getAppointmentByPatientId(
    patientId: number,
    query: IQuery,
  ): Promise<IResponse<Appointment[]>> {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.prisma.appointment.count({ where: { patientId } });
    const data = await this.prisma.appointment.findMany({
      where: {
        patientId,
      },
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
      message: 'Get all appointment success',
      data,
      pagination: {
        page,
        pageSize,
        total,
      },
    };
  }

  async getAllMedicalHistory(
    patientId: number,
    query: IQuery,
  ): Promise<IResponse<MedicalHistory[]>> {
    const user = await this.prisma.user.findUnique({
      where: { id: patientId, role: Role.PATIENT },
    });
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'Patient not found',
        data: null,
      });
    }
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.prisma.medicalHistory.count({
      where: { patientId, deletedAt: null },
    });
    const data = await this.prisma.medicalHistory.findMany({
      where: { patientId, deletedAt: null },
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

  async cancelAppointment(
    id: number,
    patientId: number,
    data: CancelAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id, patientId, deletedAt: null },
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
    if (
      appointment.status !== AppointmentStatus.PENDING &&
      appointment.status !== AppointmentStatus.CONFIRMED
    ) {
      throw new NotFoundException({
        success: false,
        message: 'Appointment cannot be canceled',
        data: null,
      });
    }
    await this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELED_BY_PATIENT,
        reasonCanceled: data.reason,
      },
    });
    await this.mailQueueService.addNotiAppointmentCanceledByPatientMail({
      to: appointment.patient.email,
      fullname: appointment.patient.fullname,
      doctorName: appointment.doctor.user.fullname,
      time: moment(appointment.startTime).format('HH:mm'),
      date: moment(appointment.startTime).format('DD/MM/YYYY'),
      serviceName: appointment.service.name,
      reason: data.reason,
    });

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
}
