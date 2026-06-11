import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterCommonFields } from "./RegisterCommonFields";
import { RegisterFormApi } from "./types";

type DoctorRegisterFormProps = {
  form: RegisterFormApi;
};

export function DoctorRegisterForm({ form }: DoctorRegisterFormProps) {
  return (
    <>
      <RegisterCommonFields form={form} />

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormItem>
            <FormLabel>Registration number</FormLabel>
            <FormControl>
              <Input
                placeholder="BMDC-12345"
                {...form.register("registrationNumber")}
              />
            </FormControl>
            <FormMessage>
              {form.formState.errors.registrationNumber?.message}
            </FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                {...form.register("gender")}
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </FormControl>
            <FormMessage>{form.formState.errors.gender?.message}</FormMessage>
          </FormItem>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormItem>
            <FormLabel>Experience</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                placeholder="5"
                {...form.register("experience")}
              />
            </FormControl>
            <FormMessage>{form.formState.errors.experience?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel>Appointment fee</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                placeholder="700"
                {...form.register("appointmentFee")}
              />
            </FormControl>
            <FormMessage>
              {form.formState.errors.appointmentFee?.message}
            </FormMessage>
          </FormItem>
        </div>

        <FormItem>
          <FormLabel>Qualification</FormLabel>
          <FormControl>
            <Input placeholder="MBBS, FCPS" {...form.register("qualification")} />
          </FormControl>
          <FormMessage>{form.formState.errors.qualification?.message}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Current workplace</FormLabel>
          <FormControl>
            <Input
              placeholder="City Hospital"
              {...form.register("currentWorkingPlace")}
            />
          </FormControl>
          <FormMessage>
            {form.formState.errors.currentWorkingPlace?.message}
          </FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Designation</FormLabel>
          <FormControl>
            <Input placeholder="Consultant" {...form.register("designation")} />
          </FormControl>
          <FormMessage>{form.formState.errors.designation?.message}</FormMessage>
        </FormItem>
      </div>
    </>
  );
}
