import Link from "next/link";
import { BadgeCheck, BriefcaseMedical, MapPin, Stethoscope } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Doctor } from "@/types/public";

function doctorInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const specialties =
    doctor.doctorSpecialties
      ?.map((item) => item.specialties?.title)
      .filter(Boolean)
      .slice(0, 3) ?? [];

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={doctor.profilePhoto} alt={doctor.name} />
            <AvatarFallback>{doctorInitials(doctor.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-950">{doctor.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{doctor.designation ?? "Doctor"}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {specialties.length > 0 ? (
                specialties.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline">General care</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-600" />
            {doctor.experience ?? 0}+ years experience
          </div>
          <div className="flex items-center gap-2">
            <BriefcaseMedical className="h-4 w-4 text-emerald-600" />
            {doctor.qualification ?? "Qualification available on profile"}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            {doctor.currentWorkingPlace ?? doctor.address ?? "Healthcare center"}
          </div>
          <div className="flex items-center gap-2 font-medium text-slate-900">
            <Stethoscope className="h-4 w-4 text-emerald-600" />
            Fee: {doctor.appointmentFee ? `BDT ${doctor.appointmentFee}` : "Contact clinic"}
          </div>
        </div>

        <Button asChild className="mt-5 w-full">
          <Link href={`/doctors/${doctor.id}`}>View profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
