"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AlertCircle, CheckCircle2, Save, UserRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roleLabels } from "@/lib/auth";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/features/auth/authApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { AppDispatch } from "@/redux/store";
import { UpdateProfileRequest, UserProfile } from "@/types/auth";

type ProfileFormState = Omit<UpdateProfileRequest, "file">;

type ApiErrorPayload = {
  data?: {
    message?: string;
  };
  error?: string;
};

const emptyProfileForm: ProfileFormState = {
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

function profileToForm(profile?: UserProfile): ProfileFormState {
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

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;

  return apiError.data?.message ?? apiError.error ?? "Unable to update profile.";
}

export function ProfileForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, isError, refetch } = useProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [form, setForm] = useState<ProfileFormState>(emptyProfileForm);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const profile = data?.user;
  const initials = profile?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (profile) {
      setForm(profileToForm(profile));
    }
  }, [profile]);

  const updateField =
    (field: keyof ProfileFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const result = await updateProfile({
        ...form,
        file,
      }).unwrap();

      dispatch(setCredentials({ user: result.user, accessToken: null }));
      setMessage(result.message ?? "Profile updated successfully.");
      setFile(null);
      await refetch();
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-slate-500">
          Loading profile...
        </CardContent>
      </Card>
    );
  }

  if (isError || !profile) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex items-center justify-between gap-4 p-6 text-red-900">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">Could not load profile data.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.profilePhoto} alt={profile.name} />
              <AvatarFallback>{initials || <UserRound className="h-6 w-6" />}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>My profile</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
              <Badge className="mt-2">{roleLabels[profile.role]}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {message ? (
          <Alert className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-900">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        {error ? (
          <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={updateField("name")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact number</Label>
              <Input
                id="contactNumber"
                value={form.contactNumber}
                onChange={updateField("contactNumber")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={form.address} onChange={updateField("address")} />
          </div>

          {profile.role === "doctor" ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration number</Label>
                  <Input
                    id="registrationNumber"
                    value={form.registrationNumber}
                    onChange={updateField("registrationNumber")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    value={form.gender ?? ""}
                    onChange={updateField("gender")}
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={updateField("experience")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointmentFee">Appointment fee</Label>
                  <Input
                    id="appointmentFee"
                    type="number"
                    min="1"
                    value={form.appointmentFee}
                    onChange={updateField("appointmentFee")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  value={form.qualification}
                  onChange={updateField("qualification")}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentWorkingPlace">Current workplace</Label>
                  <Input
                    id="currentWorkingPlace"
                    value={form.currentWorkingPlace}
                    onChange={updateField("currentWorkingPlace")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={form.designation}
                    onChange={updateField("designation")}
                  />
                </div>
              </div>
            </>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="profilePhoto">Profile photo</Label>
            <Input
              id="profilePhoto"
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </div>

          <Button type="submit" disabled={isUpdating}>
            <Save className="h-4 w-4" />
            {isUpdating ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
