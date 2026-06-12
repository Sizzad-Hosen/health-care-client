import { ApiMeta } from "./api";

export type PublicListResponse<T> = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data: T[];
  meta?: ApiMeta;
};

export type PublicDetailResponse<T> = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data: T;
};

export type Specialty = {
  id: string;
  title: string;
  icon?: string;
};

export type Doctor = {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  registrationNumber?: string;
  experience?: number;
  gender?: "MALE" | "FEMALE";
  appointmentFee?: number;
  qualification?: string;
  currentWorkingPlace?: string;
  designation?: string;
  doctorSpecialties?: Array<{
    specialties?: Specialty;
    specialtiesId?: string;
  }>;
};

export type Review = {
  id: string;
  appointmentId?: string;
  doctorId?: string;
  patientId?: string;
  rating: number;
  comment?: string | null;
  createdAt?: string;
  patient?: {
    name?: string;
    email?: string;
  };
  doctor?: {
    name?: string;
    email?: string;
  };
};

export type CreateReviewRequest = {
  appointmentId: string;
  rating: number;
  comment?: string;
};

export type ReviewFilters = {
  patientEmail?: string;
  doctorEmail?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type DoctorFilters = {
  searchTerm?: string;
  gender?: string;
  specialties?: string;
  page?: number;
  limit?: number;
};
