import { RegisterCommonFields } from "./RegisterCommonFields";
import { RegisterFormApi } from "./types";

type PatientRegisterFormProps = {
  form: RegisterFormApi;
};

export function PatientRegisterForm({ form }: PatientRegisterFormProps) {
  return <RegisterCommonFields form={form} />;
}
