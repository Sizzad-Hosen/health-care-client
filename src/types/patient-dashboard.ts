import { Appointment, InitPaymentResponse, Schedule } from "@/types/appointment";
import { ApiMeta } from "@/types/api";
import { Doctor } from "@/types/public";

export type PatientMeta = {
  appointmentCount?: number;
  prescriptionCount?: number;
  reviewCount?: number;
  formattedAppointmentStatusDistribution?: Array<{
    status: string;
    count: number;
  }>;
};

export type PaginatedResult<T> = {
  data: T[];
  meta?: ApiMeta;
};

export type PatientAppointment = Appointment & {
  doctor?: Doctor;
  schedule?: Schedule;
  review?: {
    id: string;
    rating: number;
    comment: string;
  } | null;
};

export type Prescription = {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  instructions: string;
  followUpDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  doctor?: Doctor;
  appointment?: Appointment;
};

export type PatientQuery = {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type PatientInitPaymentResponse = InitPaymentResponse;
