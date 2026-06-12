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
  useGetPatientProfileQuery,
  useUpdatePatientProfileMutation,
} from "@/redux/features/patientDashboard/patientDashboardApi";
import { UpdateProfileRequest, UserProfile } from "@/types/auth";

type PatientProfileFormState = {
  name: string;
  contactNumber: string;
  address: string;
  gender: "" | "MALE" | "FEMALE";
};

type ApiErrorPayload = {
  data?: {
    message?: string;
  };
  error?: string;
};

const emptyForm: PatientProfileFormState = {
  name: "",
  contactNumber: "",
  address: "",
  gender: "",
};

function profileToForm(profile?: UserProfile): PatientProfileFormState {
  return {
    name: profile?.name ?? "",
    contactNumber: profile?.contactNumber ?? "",
    address: profile?.address ?? "",
    gender: profile?.gender ?? "",
  };
}

function getInitials(name?: string) {
  return (name ?? "PT")
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

export function PatientProfileForm() {
  const { toast } = useToast();
  const { data, isLoading, isError, refetch } = useGetPatientProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdatePatientProfileMutation();
  const [form, setForm] = useState<PatientProfileFormState>(emptyForm);
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
    (field: keyof PatientProfileFormState) =>
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

    const payload: UpdateProfileRequest = {
      name: form.name,
      contactNumber: form.contactNumber,
      address: form.address,
      gender: form.gender || undefined,
      file,
    };

    try {
      const result = await updateProfile(payload).unwrap();
      setMessage(result.message ?? "Profile updated successfully.");
      setFile(null);
      toast({
        title: "Profile updated",
        description: "Your patient profile has been saved.",
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
            {Array.from({ length: 4 }).map((_, index) => (
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
              <p className="font-semibold">Could not load profile</p>
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
            <AvatarFallback>
              {getInitials(profile.name) || <UserRound className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Patient profile</CardTitle>
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
            <div className="space-y-2">
              <Label htmlFor="patient-name">Name</Label>
              <Input id="patient-name" value={form.name} onChange={updateField("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-phone">Contact number</Label>
              <Input
                id="patient-phone"
                value={form.contactNumber}
                onChange={updateField("contactNumber")}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patient-gender">Gender</Label>
              <select
                id="patient-gender"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                value={form.gender}
                onChange={updateField("gender")}
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-photo">Profile photo</Label>
              <Input
                id="patient-photo"
                type="file"
                accept="image/*"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient-address">Address</Label>
            <Input
              id="patient-address"
              value={form.address}
              onChange={updateField("address")}
            />
          </div>

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isUpdating ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
