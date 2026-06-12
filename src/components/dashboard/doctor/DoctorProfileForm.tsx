"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save, UserRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import {
  useGetDoctorProfileQuery,
  useUpdateDoctorProfileMutation,
} from "@/redux/features/doctorDashboard/doctorDashboardApi";
import { UpdateProfileRequest, UserProfile } from "@/types/auth";

type DoctorProfileFormState = Omit<UpdateProfileRequest, "file">;

type ApiErrorPayload = {
  data?: {
    message?: string;
  };
  error?: string;
};

const emptyForm: DoctorProfileFormState = {
  name: "",
  contactNumber: "",
  address: "",
  registrationNumber: "",
  experience: "",
  gender: undefined,
  appointmentFee: "",
  qualification: "",
  currentWorkingPlace: "",
  designation: "",
};

function profileToForm(profile?: UserProfile): DoctorProfileFormState {
  return {
    name: profile?.name ?? "",
    contactNumber: profile?.contactNumber ?? "",
    address: profile?.address ?? "",
    registrationNumber: profile?.registrationNumber ?? "",
    experience: profile?.experience?.toString() ?? "",
    gender: profile?.gender,
    appointmentFee: profile?.appointmentFee?.toString() ?? "",
    qualification: profile?.qualification ?? "",
    currentWorkingPlace: profile?.currentWorkingPlace ?? "",
    designation: profile?.designation ?? "",
  };
}

function initials(name?: string) {
  return (name ?? "DR")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;

  return apiError.data?.message ?? apiError.error ?? "Unable to update profile.";
}

export function DoctorProfileForm() {
  const { toast } = useToast();
  const { data, isLoading, isError, refetch } = useGetDoctorProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateDoctorProfileMutation();
  const [form, setForm] = useState<DoctorProfileFormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const profile = data?.user;

  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(profileToForm(profile));
    }
  }, [profile]);

  const updateField =
    (field: keyof DoctorProfileFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const result = await updateProfile({ ...form, file }).unwrap();
      setFile(null);
      setMessage(result.message ?? "Profile updated successfully.");
      toast({
        title: "Profile updated",
        description: "Your doctor profile has been saved.",
        variant: "success",
      });
    } catch (error) {
      const nextError = getErrorMessage(error);
      setError(nextError);
      toast({
        title: "Profile update failed",
        description: nextError,
        variant: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !profile) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex flex-col gap-4 p-6 text-red-900 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-semibold">Could not load doctor profile</p>
              <p className="mt-1 text-sm">Please retry after checking your session.</p>
            </div>
          </div>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.profilePhoto} alt={profile.name} />
            <AvatarFallback>{initials(profile.name) || <UserRound className="h-6 w-6" />}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Doctor profile</CardTitle>
            <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {message ? (
          <Alert className="mb-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}
        {error ? (
          <Alert className="mb-4 border-red-200 bg-red-50 text-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <Label htmlFor="doctor-name">Name</Label>
              <Input id="doctor-name" value={form.name} onChange={updateField("name")} />
            </label>
            <label className="space-y-2">
              <Label htmlFor="doctor-phone">Contact number</Label>
              <Input id="doctor-phone" value={form.contactNumber} onChange={updateField("contactNumber")} />
            </label>
            <label className="space-y-2">
              <Label htmlFor="doctor-registration">Registration number</Label>
              <Input id="doctor-registration" value={form.registrationNumber} onChange={updateField("registrationNumber")} />
            </label>
            <label className="space-y-2">
              <Label htmlFor="doctor-gender">Gender</Label>
              <select
                id="doctor-gender"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                value={form.gender ?? ""}
                onChange={updateField("gender")}
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </label>
            <label className="space-y-2">
              <Label htmlFor="doctor-experience">Experience</Label>
              <Input id="doctor-experience" type="number" min="0" value={form.experience} onChange={updateField("experience")} />
            </label>
            <label className="space-y-2">
              <Label htmlFor="doctor-fee">Appointment fee</Label>
              <Input id="doctor-fee" type="number" min="1" value={form.appointmentFee} onChange={updateField("appointmentFee")} />
            </label>
            <label className="space-y-2">
              <Label htmlFor="doctor-workplace">Current workplace</Label>
              <Input id="doctor-workplace" value={form.currentWorkingPlace} onChange={updateField("currentWorkingPlace")} />
            </label>
            <label className="space-y-2">
              <Label htmlFor="doctor-designation">Designation</Label>
              <Input id="doctor-designation" value={form.designation} onChange={updateField("designation")} />
            </label>
          </div>
          <label className="block space-y-2">
            <Label htmlFor="doctor-qualification">Qualification</Label>
            <Input id="doctor-qualification" value={form.qualification} onChange={updateField("qualification")} />
          </label>
          <label className="block space-y-2">
            <Label htmlFor="doctor-address">Address</Label>
            <Input id="doctor-address" value={form.address} onChange={updateField("address")} />
          </label>
          <label className="block space-y-2">
            <Label htmlFor="doctor-photo">Profile photo</Label>
            <Input id="doctor-photo" type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          </label>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isUpdating ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
