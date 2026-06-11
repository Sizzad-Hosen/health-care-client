"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/lib/validations/auth.schema";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";

type ApiErrorPayload = {
  data?: {
    message?: string;
  };
  error?: string;
};

function getErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;

  return apiError.data?.message ?? apiError.error ?? "Unable to send reset link.";
}

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setError(null);
    setMessage(null);

    try {
      const result = await forgotPassword(values).unwrap();
      setMessage(result.message ?? "Please check your email for a reset link.");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {message ? (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
            <MailCheck className="h-4 w-4" />
            <AlertTitle>Reset instructions sent</AlertTitle>
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
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="you@healthcare.com"
                {...form.register("email")}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.email?.message}</FormMessage>
          </FormItem>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send reset link"}
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
