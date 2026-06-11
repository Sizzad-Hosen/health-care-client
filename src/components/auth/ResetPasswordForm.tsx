"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
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
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/lib/validations/auth.schema";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";

type ApiErrorPayload = {
  data?: {
    message?: string;
  };
  error?: string;
};

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;

  return apiError.data?.message ?? apiError.error ?? "Unable to reset password.";
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const token = searchParams.get("token") ?? "";
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    form.setValue("token", token);
  }, [form, token]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setError(null);
    setMessage(null);

    try {
      const result = await resetPassword({
        token: values.token,
        password: values.password,
      }).unwrap();
      setMessage(result.message ?? "Password reset successfully.");
      setTimeout(() => router.replace("/login"), 1200);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
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

        {!token ? (
          <Alert className="border-amber-200 bg-amber-50 text-amber-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Reset token is missing. Open the reset link from your email.
            </AlertDescription>
          </Alert>
        ) : null}

        <Form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <input type="hidden" {...form.register("token")} />

          <FormItem>
            <FormLabel>New password</FormLabel>
            <FormControl>
              <PasswordInput
                placeholder="Minimum 6 characters"
                {...form.register("password")}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.password?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel>Confirm password</FormLabel>
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

          <Button type="submit" className="w-full" disabled={isLoading || !token}>
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>
        </Form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Remember password?{" "}
          <Link className="font-medium text-emerald-700" href="/login">
            Back to login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
