"use client";

import { CalendarDays, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const doctors = ["Dr. Farhana Rahman", "Dr. Arif Hossain", "Dr. Nadia Islam"];
const slots = ["09:30", "11:00", "14:30", "17:00"];

export function AppointmentBooking() {
  const [doctor, setDoctor] = useState(doctors[0]);
  const [slot, setSlot] = useState(slots[1]);
  const [paid, setPaid] = useState(false);
  const fee = 1200;
  const serviceCharge = 40;
  const total = useMemo(() => fee + serviceCharge, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card className="dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="grid gap-5 p-6">
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Appointment booking
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
              Book a verified doctor in minutes
            </h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Patient name
              <Input placeholder="Your full name" className="dark:border-slate-700 dark:bg-slate-950" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Contact number
              <Input placeholder="+880..." className="dark:border-slate-700 dark:bg-slate-950" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Doctor
              <select
                value={doctor}
                onChange={(event) => setDoctor(event.target.value)}
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                {doctors.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Visit type
              <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950">
                <option>In-person consultation</option>
                <option>Video consultation</option>
              </select>
            </label>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
              Available slots
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {slots.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSlot(item)}
                  className={`rounded-md border px-4 py-3 text-sm font-medium transition ${
                    slot === item
                      ? "border-emerald-500 bg-emerald-600 text-white"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Reason for visit
            <textarea
              rows={4}
              placeholder="Briefly describe symptoms or follow-up needs"
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
        </CardContent>
      </Card>

      <Card className="h-fit dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="p-6">
          <CalendarDays className="h-6 w-6 text-emerald-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">
            Booking summary
          </h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex justify-between gap-4">
              <span>Doctor</span>
              <span className="font-medium text-slate-950 dark:text-white">{doctor}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Slot</span>
              <span className="font-medium text-slate-950 dark:text-white">Today, {slot}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Consultation</span>
              <span>BDT {fee}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Service charge</span>
              <span>BDT {serviceCharge}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 font-semibold text-slate-950 dark:border-slate-700 dark:text-white">
              Total: BDT {total}
            </div>
          </div>
          <Button type="button" className="mt-6 w-full" onClick={() => setPaid(true)}>
            <CreditCard className="h-4 w-4" />
            Pay securely
          </Button>
          {paid ? (
            <div className="mt-4 flex items-start gap-2 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
              <CheckCircle2 className="mt-0.5 h-4 w-4" />
              Payment authorized. Appointment confirmation is ready.
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
              <ShieldCheck className="mt-0.5 h-4 w-4" />
              Demo payment layer prepared for Stripe, SSLCommerz, or your gateway.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
