"use client";

import { ChangeEvent, FormEvent, MouseEvent } from "react";
import { Edit3, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminDoctor, AdminPatient } from "@/types/admin-dashboard";

export type DoctorEditForm = {
  name: string;
  contactNumber: string;
  qualification: string;
  designation: string;
  currentWorkingPlace: string;
  experience: string;
  appointmentFee: string;
};

export type PatientEditForm = {
  name: string;
  contactNumber: string;
  address: string;
};

export function doctorToForm(doctor: AdminDoctor): DoctorEditForm {
  return {
    name: doctor.name ?? "",
    contactNumber: doctor.contactNumber ?? "",
    qualification: doctor.qualification ?? "",
    designation: doctor.designation ?? "",
    currentWorkingPlace: doctor.currentWorkingPlace ?? "",
    experience: doctor.experience?.toString() ?? "",
    appointmentFee: doctor.appointmentFee?.toString() ?? "",
  };
}

export function patientToForm(patient: AdminPatient): PatientEditForm {
  return {
    name: patient.name ?? "",
    contactNumber: patient.contactNumber ?? "",
    address: patient.address ?? "",
  };
}

function stop(event: MouseEvent<HTMLDivElement>) {
  event.stopPropagation();
}

export function DoctorEditModal({
  form,
  isLoading,
  onChange,
  onClose,
  onSubmit,
}: {
  form: DoctorEditForm;
  isLoading: boolean;
  onChange: (field: keyof DoctorEditForm) => (event: ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl" onClick={stop}>
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Edit doctor</h2>
            <p className="text-sm text-slate-500">Update doctor profile fields.</p>
          </div>
          <Button type="button" size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form className="grid gap-4 p-5 md:grid-cols-2" onSubmit={onSubmit}>
          {Object.keys(form).map((key) => (
            <Input
              key={key}
              placeholder={key}
              value={form[key as keyof DoctorEditForm]}
              onChange={onChange(key as keyof DoctorEditForm)}
            />
          ))}
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit3 className="h-4 w-4" />}
              Save changes
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PatientEditModal({
  form,
  isLoading,
  onChange,
  onClose,
  onSubmit,
}: {
  form: PatientEditForm;
  isLoading: boolean;
  onChange: (field: keyof PatientEditForm) => (event: ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onClick={onClose}>
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl" onClick={stop}>
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Edit patient</h2>
            <p className="text-sm text-slate-500">Update patient profile fields.</p>
          </div>
          <Button type="button" size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form className="grid gap-4 p-5" onSubmit={onSubmit}>
          <Input placeholder="Name" value={form.name} onChange={onChange("name")} />
          <Input placeholder="Contact number" value={form.contactNumber} onChange={onChange("contactNumber")} />
          <Input placeholder="Address" value={form.address} onChange={onChange("address")} />
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit3 className="h-4 w-4" />}
              Save changes
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
