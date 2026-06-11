import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  contactNumber: z.string().min(5, "Contact number is required"),
  address: z.string().min(3, "Address is required"),
  role: z.enum(["patient", "doctor"]),
  registrationNumber: z.string().optional(),
  experience: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  appointmentFee: z.string().optional(),
  qualification: z.string().optional(),
  currentWorkingPlace: z.string().optional(),
  designation: z.string().optional(),
}).superRefine((values, ctx) => {
  if (values.role !== "doctor") {
    return;
  }

  const requiredDoctorFields: Array<keyof typeof values> = [
    "registrationNumber",
    "gender",
    "appointmentFee",
    "qualification",
    "currentWorkingPlace",
    "designation",
  ];

  requiredDoctorFields.forEach((field) => {
    if (!values[field]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [field],
        message: "Required for doctor registration",
      });
    }
  });

  if (values.experience && Number(values.experience) < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["experience"],
      message: "Experience cannot be negative",
    });
  }

  if (!values.appointmentFee || Number(values.appointmentFee) <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["appointmentFee"],
      message: "Appointment fee must be greater than 0",
    });
  }
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
