"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useGetPatientsQuery,
} from "@/redux/features/adminDashboard/adminDashboardApi";
import { totalPages } from "./utils";

export function PatientsManagement() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isFetching, isError, refetch } = useGetPatientsQuery({
    page,
    limit: 10,
    searchTerm: searchTerm || undefined,
  });
  const patients = data?.data ?? [];
  const pages = totalPages(data?.meta?.total, data?.meta?.limit ?? 10);

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search patients"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr><td className="p-6 text-slate-500" colSpan={5}>Loading patients...</td></tr>
                ) : isError ? (
                  <tr><td className="p-6 text-red-600" colSpan={5}>Could not load patients.</td></tr>
                ) : patients.length === 0 ? (
                  <tr><td className="p-6 text-slate-500" colSpan={5}>No patients found.</td></tr>
                ) : patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="cursor-pointer border-b transition-colors hover:bg-slate-50"
                    tabIndex={0}
                    onClick={() => router.push(`/dashboard/admin/patients/${patient.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && patient.id) {
                        router.push(`/dashboard/admin/patients/${patient.id}`);
                      }
                    }}
                  >
                    <td className="p-4 font-medium text-slate-950">{patient.name}<p className="text-xs text-slate-500">{patient.email}</p></td>
                    <td className="p-4">{patient.contactNumber ?? "-"}</td>
                    <td className="p-4">{patient.address ?? "-"}</td>
                    <td className="p-4">{patient.isDeleted ? "Deleted" : "Active"}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={(event) => { event.stopPropagation(); router.push(`/dashboard/admin/patients/${patient.id}`); }}>
                          <Eye className="h-4 w-4" />
                          View details
                        </Button>
                      </div>
                    </td>
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
