import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { RegisterFormApi } from "./types";

type RegisterCommonFieldsProps = {
  form: RegisterFormApi;
};

export function RegisterCommonFields({ form }: RegisterCommonFieldsProps) {
  return (
    <>
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
          <PasswordInput
            placeholder="Minimum 6 characters"
            {...form.register("password")}
          />
        </FormControl>
        <FormMessage>{form.formState.errors.password?.message}</FormMessage>
      </FormItem>

      <FormItem>
        <FormLabel>Contact number</FormLabel>
        <FormControl>
          <Input
            placeholder="+880 1712 345678"
            {...form.register("contactNumber")}
          />
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
    </>
  );
}
