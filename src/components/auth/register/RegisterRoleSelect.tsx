import { Stethoscope, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegisterRole } from "./types";

type RegisterRoleSelectProps = {
  onSelect: (role: RegisterRole) => void;
};

export function RegisterRoleSelect({ onSelect }: RegisterRoleSelectProps) {
  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="h-auto w-full justify-start p-4 text-left"
        onClick={() => onSelect("patient")}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
          <UserRound className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">Join as Patient</span>
          <span className="block whitespace-normal text-sm font-normal text-slate-500">
            Create a patient account to book appointments and manage your care.
          </span>
        </span>
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-auto w-full justify-start p-4 text-left"
        onClick={() => onSelect("doctor")}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
          <Stethoscope className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">Join as Doctor</span>
          <span className="block whitespace-normal text-sm font-normal text-slate-500">
            Create a doctor account with professional and registration details.
          </span>
        </span>
      </Button>
    </div>
  );
}
