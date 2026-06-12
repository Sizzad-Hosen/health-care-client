"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAppointmentsQuery } from "@/redux/features/adminDashboard/adminDashboardApi";
import { formatSchedule, statusClass, totalPages } from "./utils";

export function AppointmentsManagement() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const { data, isFetching, isError, refetch } = useGetAppointmentsQuery({
    page,
    limit: 10,
    status: status || undefined,
    paymentStatus: paymentStatus || undefined,
    patientEmail: patientEmail || undefined,
  });
  const appointments = data?.data ?? [];
  const pages = totalPages(data?.meta?.total, data?.meta?.limit ?? 10);

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_180px_180px_auto]">
          <Input
            placeholder="Filter by patient email"
            value={patientEmail}
            onChange={(event) => {
              setPatientEmail(event.target.value);
              setPage(1);
            }}
          />
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
            <option value="">Any status</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="INPROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
          </select>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm" value={paymentStatus} onChange={(event) => { setPaymentStatus(event.target.value); setPage(1); }}>
            <option value="">Any payment</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
          </select>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr><td className="p-6 text-slate-500" colSpan={5}>Loading appointments...</td></tr>
                ) : isError ? (
                  <tr><td className="p-6 text-red-600" colSpan={5}>Could not load appointments.</td></tr>
                ) : appointments.length === 0 ? (
                  <tr><td className="p-6 text-slate-500" colSpan={5}>No appointments found.</td></tr>
                ) : appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b">
                    <td className="p-4">{appointment.doctor?.name ?? appointment.doctorId}</td>
                    <td className="p-4">{appointment.patient?.name ?? appointment.patientId}<p className="text-xs text-slate-500">{appointment.patient?.email}</p></td>
                    <td className="p-4">{formatSchedule(appointment.schedule)}</td>
                    <td className="p-4"><Badge className={statusClass(appointment.status)}>{appointment.status}</Badge></td>
                    <td className="p-4"><Badge className={statusClass(appointment.paymentStatus)}>{appointment.paymentStatus}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</Button>
        <p className="text-sm text-slate-500">Page {page} of {pages}</p>
        <Button type="button" variant="outline" disabled={page >= pages} onClick={() => setPage((current) => Math.min(pages, current + 1))}>Next</Button>
      </div>
    </div>
  );
}
