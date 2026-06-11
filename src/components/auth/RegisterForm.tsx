"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
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
import { roleDashboardPath } from "@/lib/auth";
import {
  RegisterFormValues,
  registerSchema,
} from "@/lib/validations/auth.schema";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/toast";

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contactNumber: "",
      address: "",
      role: "patient",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);

    try {
      const result = await registerUser(values).unwrap();
      dispatch(setCredentials(result));
      toast({
        title: "Account created",
        description: "Welcome to your patient dashboard.",
        variant: "success",
      });
      router.replace(roleDashboardPath[result.user.role]);
    } catch {
      setError("Account creation failed. Check the details and try again.");
      toast({
        title: "Registration failed",
        description: "The backend rejected this registration request.",
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
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

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
            <FormLabel>Contact number</FormLabel>
            <FormControl>
              <Input placeholder="+880 1712 345678" {...form.register("contactNumber")} />
            </FormControl>
            <FormMessage>{form.formState.errors.contactNumber?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="House, road, city" {...form.register("address")} />
            </FormControl>
            <FormMessage>{form.formState.errors.address?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <input type="hidden" {...form.register("role")} />
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              Public registration creates a patient account. Doctor and admin
              accounts should be created from a protected admin module.
            </div>
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
