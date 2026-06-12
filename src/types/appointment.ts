import { Doctor } from "@/types/public";

export type Schedule = {
  id: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DoctorSchedule = {
  doctorId: string;
  scheduleId: string;
  isBooked: boolean;
  appointmentId?: string | null;
  doctor?: Doctor;
  schedule?: Schedule;
};

export type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  videoCallingId?: string;
  status?: "SCHEDULED" | "INPROGRESS" | "COMPLETED" | "CANCELED";
  paymentStatus?: "PAID" | "UNPAID";
  createdAt?: string;
  updatedAt?: string;
  doctor?: Doctor;
  schedule?: Schedule;
};

export type CreateAppointmentRequest = {
  doctorId: string;
  scheduleId: string;
};

export type DoctorScheduleFilters = {
  doctorId: string;
  isBooked?: boolean;
  page?: number;
  limit?: number;
};

export type InitPaymentResponse = {
  paymentUrl?: string;
};
