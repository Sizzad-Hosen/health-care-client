import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/toast";
import { roleDashboardPath } from "@/lib/auth";
import { RegisterFormValues } from "@/lib/validations/auth.schema";
import {
  useCreateDoctorMutation,
  useCreatePatientMutation,
  useLoginMutation,
} from "@/redux/features/auth/authApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { AppDispatch } from "@/redux/store";
import { getRegistrationErrorMessage } from "./registrationErrors";

type UseRegisterSubmitOptions = {
  onError: (message: string) => void;
};

export function useRegisterSubmit({ onError }: UseRegisterSubmitOptions) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [createPatient, { isLoading: isCreatingPatient }] =
    useCreatePatientMutation();
  const [createDoctor, { isLoading: isCreatingDoctor }] =
    useCreateDoctorMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const isLoading = isCreatingPatient || isCreatingDoctor || isLoggingIn;

  const submitRegistration = async (values: RegisterFormValues) => {
    try {
      if (values.role === "doctor") {
        await createDoctor(values).unwrap();
      } else {
        await createPatient(values).unwrap();
      }

      const result = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      dispatch(setCredentials(result));
      toast({
        title: "Account created",
        description: `Welcome to your ${result.user.role} dashboard.`,
        variant: "success",
      });
      router.replace(roleDashboardPath[result.user.role]);
    } catch (error) {
      const message = getRegistrationErrorMessage(error);

      onError(message);
      toast({
        title: "Registration failed",
        description: message,
        variant: "error",
      });
    }
  };

  return {
    isLoading,
    submitRegistration,
  };
}
