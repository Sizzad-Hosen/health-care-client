"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  RegisterFormValues,
  registerSchema,
} from "@/lib/validations/auth.schema";
import { DoctorRegisterForm } from "./register/DoctorRegisterForm";
import { PatientRegisterForm } from "./register/PatientRegisterForm";
import { RegisterRoleSelect } from "./register/RegisterRoleSelect";
import { RegisterRole } from "./register/types";
import { useRegisterSubmit } from "./register/useRegisterSubmit";

const defaultRegisterValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  contactNumber: "",
  address: "",
  role: "patient",
  registrationNumber: "",
  experience: "",
  gender: undefined,
  appointmentFee: "",
  qualification: "",
  currentWorkingPlace: "",
  designation: "",
};

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<RegisterRole | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultRegisterValues,
  });
  const { isLoading, submitRegistration } = useRegisterSubmit({
    onError: setError,
  });

  const chooseRole = (role: RegisterRole) => {
    setError(null);
    setSelectedRole(role);
    form.setValue("role", role, { shouldValidate: true });
  };

  const changeRole = () => {
    setError(null);
    setSelectedRole(null);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    await submitRegistration(values);
  };

  return (
    <Card>
      <CardContent className="p-6">
        {!selectedRole ? (
          <RegisterRoleSelect onSelect={chooseRole} />
        ) : (
          <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {selectedRole === "patient"
                    ? "Patient registration"
                    : "Doctor registration"}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedRole === "patient"
                    ? "Enter your patient account information."
                    : "Enter your doctor profile and registration information."}
                </p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={changeRole}>
                <ArrowLeft className="h-4 w-4" />
                Change
              </Button>
            </div>

            {error ? (
              <Alert className="border-red-200 bg-red-50 text-red-800">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <input type="hidden" {...form.register("role")} />

            {selectedRole === "patient" ? (
              <PatientRegisterForm form={form} />
            ) : (
              <DoctorRegisterForm form={form} />
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              <UserPlus className="h-4 w-4" />
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </Form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="font-medium text-emerald-700" href="/login">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
