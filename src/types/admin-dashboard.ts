import { Schedule } from "@/types/appointment";
import { ApiMeta } from "@/types/api";
import { Doctor, Specialty } from "@/types/public";
import { DoctorAppointment, PatientSummary, PrescriptionResponse } from "@/types/doctor-dashboard";

export type AdminMeta = {
  appointmentCount?: number;
  patientCount?: number;
  doctorCount?: number;
  adminCount?: number;
  paymentCount?: number;
  totalRevenue?: {
    _sum?: {
      amount?: number | null;
    };
  };
  barChartData?: Array<{ month: string; count: number }>;
  pieCharData?: Array<{ status: string; count: number }>;
};

export type PaginatedResult<T> = {
  data: T[];
  meta?: ApiMeta;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  profilePhoto?: string;
  isDeleted?: boolean;
};

export type AdminDoctor = Doctor & {
  isDeleted?: boolean;
};

export type AdminPatient = PatientSummary & {
  isDeleted?: boolean;
  gender?: "MALE" | "FEMALE";
};

export type AdminAppointment = DoctorAppointment;

export type AdminPrescription = PrescriptionResponse & {
  createdAt?: string;
  updatedAt?: string;
  doctor?: Doctor;
  patient?: PatientSummary;
  appointment?: AdminAppointment;
};

export type AdminQuery = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  gender?: string;
  specialties?: string;
  status?: string;
  paymentStatus?: string;
  patientEmail?: string;
  doctorEmail?: string;
  startDate?: string;
  endDate?: string;
};

export type UpdateDoctorRequest = {
  id: string;
  body: Partial<{
    name: string;
    contactNumber: string;
    registrationNumber: string;
    experience: number;
    gender: "MALE" | "FEMALE";
    apointmentFee: number;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
  }>;
};

export type UpdatePatientRequest = {
  id: string;
  body: Partial<{
    name: string;
    contactNumber: string;
    contactNo: string;
    address: string;
    gender: "MALE" | "FEMALE";
  }>;
};

export type CreateSpecialtyRequest = {
  title: string;
  file?: File | null;
};

export type UpdateSpecialtyRequest = CreateSpecialtyRequest & {
  id: string;
};

export type CreateScheduleRequest = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

export type UpdateScheduleRequest = CreateScheduleRequest & {
  id: string;
};

export type AdminSchedule = Schedule;
export type AdminSpecialty = Specialty;
