import { DoctorSchedule, Schedule } from "@/types/appointment";
import { ApiMeta } from "@/types/api";
import { Doctor } from "@/types/public";

export type DoctorMeta = {
  appointmentCount?: number;
  reviewCount?: number;
  patientCount?: number;
  totalRevenue?: {
    _sum?: {
      amount?: number | null;
    };
  };
  formattedAppointmentStatusDistribution?: Array<{
    status: string;
    count: number;
  }>;
};

export type PaginatedResult<T> = {
  data: T[];
  meta?: ApiMeta;
};

export type PatientSummary = {
  id?: string;
  name?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
  profilePhoto?: string;
};

export type DoctorAppointment = {
  id: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  videoCallingId?: string;
  status?: "SCHEDULED" | "INPROGRESS" | "COMPLETED" | "CANCELED";
  paymentStatus?: "PAID" | "UNPAID";
  createdAt?: string;
  updatedAt?: string;
  patient?: PatientSummary;
  doctor?: Doctor;
  schedule?: Schedule;
};

export type DoctorScheduleRow = DoctorSchedule;

export type AssignDoctorSchedulesRequest = {
  scheduleIds: string[];
};

export type UpdateAppointmentStatusRequest = {
  appointmentId: string;
  status: "SCHEDULED" | "INPROGRESS" | "COMPLETED" | "CANCELED";
};

export type CreatePrescriptionRequest = {
  appointmentId: string;
  instructions: string;
};

export type PrescriptionResponse = {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  instructions: string;
  followUpDate?: string | null;
};

export type DoctorQuery = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
  isBooked?: boolean;
  status?: string;
  paymentStatus?: string;
};
