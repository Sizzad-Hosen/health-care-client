"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, LogIn } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { roleDashboardPath } from "@/lib/auth";
import { LoginFormValues, loginSchema } from "@/lib/validations/auth.schema";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/toast";

type ApiErrorPayload = {
  data?: {
    message?: string;
  };
  error?: string;
};

function getLoginErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;

  return (
    apiError.data?.message ??
    apiError.error ??
    "Invalid email or password."
  );
}

export function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);

    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials(result));
      toast({
        title: "Signed in",
        description: `Welcome back, ${result.user.name}.`,
        variant: "success",
      });
      router.replace(roleDashboardPath[result.user.role]);
    } catch (error) {
      const message = getLoginErrorMessage(error);

      setError(message);
      toast({
        title: "Sign in failed",
        description: message,
        variant: "error",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error ? (
            <Alert className="border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="admin@healthcare.com"
                {...form.register("email")}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.email?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <div className="flex items-center justify-between gap-3">
              <FormLabel>Password</FormLabel>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                Forgot password?
              </Link>
            </div>
            <FormControl>
              <PasswordInput placeholder="password123" {...form.register("password")} />
            </FormControl>
            <FormMessage>{form.formState.errors.password?.message}</FormMessage>
          </FormItem>

          <Button type="submit" className="w-full" disabled={isLoading}>
            <LogIn className="h-4 w-4" />
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </Form>

        <div className="mt-6 rounded-md bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-800">Backend required</p>
          <p>Use a real account from the Express API database.</p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Need an account?{" "}
          <Link className="font-medium text-emerald-700" href="/register">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
