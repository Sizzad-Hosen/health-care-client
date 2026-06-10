"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { roleDashboardPath } from "@/lib/auth";
import {
  RegisterFormValues,
  registerSchema,
} from "@/lib/validations/auth.schema";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "patient",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const result = await registerUser(values).unwrap();
    dispatch(setCredentials(result));
    router.replace(roleDashboardPath[result.user.role]);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Ayesha Rahman" {...form.register("name")} />
            </FormControl>
            <FormMessage>{form.formState.errors.name?.message}</FormMessage>
          </FormItem>

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

          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                {...form.register("password")}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.password?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormControl>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                {...form.register("role")}
              >
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
              </select>
            </FormControl>
            <FormMessage>{form.formState.errors.role?.message}</FormMessage>
          </FormItem>

          <Button type="submit" className="w-full" disabled={isLoading}>
            <UserPlus className="h-4 w-4" />
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </Form>

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
