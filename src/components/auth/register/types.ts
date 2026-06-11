import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "@/lib/validations/auth.schema";

export type RegisterRole = RegisterFormValues["role"];

export type RegisterFormApi = UseFormReturn<RegisterFormValues>;
