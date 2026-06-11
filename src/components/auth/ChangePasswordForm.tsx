"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from "@/lib/validations/auth.schema";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";

type ApiErrorPayload = {
  data?: {
    message?: string;
  };
  error?: string;
};

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;

  return apiError.data?.message ?? apiError.error ?? "Unable to change password.";
}

export function ChangePasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setError(null);
    setMessage(null);

    try {
      const result = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();
      form.reset();
      setMessage(result.message ?? "Password changed successfully.");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Change password
            </h2>
            <p className="text-sm text-slate-500">
              Update the password for your current account.
            </p>
          </div>
        </div>

        {message ? (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        {error ? (
          <Alert className="border-red-200 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <FormItem>
            <FormLabel>Current password</FormLabel>
            <FormControl>
              <PasswordInput
                placeholder="Current password"
                {...form.register("oldPassword")}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.oldPassword?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel>New password</FormLabel>
            <FormControl>
              <PasswordInput
                placeholder="Minimum 6 characters"
                {...form.register("newPassword")}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.newPassword?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel>Confirm new password</FormLabel>
            <FormControl>
              <PasswordInput
                placeholder="Confirm new password"
                {...form.register("confirmPassword")}
              />
            </FormControl>
            <FormMessage>
              {form.formState.errors.confirmPassword?.message}
            </FormMessage>
          </FormItem>

          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update password"}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
