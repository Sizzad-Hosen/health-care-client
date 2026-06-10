import { apiClient } from "@/lib/apiClient";
import { ApiListResponse } from "@/types/api";
import { AuthUser } from "@/types/auth";
import { DashboardData, DashboardEntity } from "@/types/dashboard";

const countFromResponse = (response: ApiListResponse<DashboardEntity>): number => {
  return response.meta?.total ?? response.data.length;
};

const safeCount = async (path: string): Promise<number> => {
  const response = await apiClient<ApiListResponse<DashboardEntity>>(path);
  return countFromResponse(response);
};

export async function getDashboardData(user: AuthUser): Promise<DashboardData> {
  if (user.role === "admin") {
    const [doctorCount, patientCount, appointmentCount] = await Promise.all([
      safeCount("/api/v1/doctor"),
      safeCount("/api/v1/patient"),
      safeCount("/api/v1/appointments"),
    ]);

    return {
      source: "backend",
      metrics: [
        {
          title: "Total doctors",
          value: String(doctorCount),
          helper: "Loaded from backend doctors API",
        },
        {
          title: "Total patients",
          value: String(patientCount),
          helper: "Loaded from backend patients API",
        },
        {
          title: "Total appointments",
          value: String(appointmentCount),
          helper: "Loaded from backend appointments API",
        },
        {
          title: "Pending appointments",
          value: "0",
          helper: "Requires backend status aggregate endpoint",
        },
      ],
      priorities: [
        "Review backend appointment status aggregates.",
        "Verify doctor and patient records.",
        "Monitor payment settlement from backend reports.",
      ],
    };
  }

  const appointmentCount = await safeCount("/api/v1/appointments/my-appointment");

  if (user.role === "doctor") {
    return {
      source: "backend",
      metrics: [
        {
          title: "Today's appointments",
          value: String(appointmentCount),
          helper: "Loaded from backend appointment API",
        },
        {
          title: "Total patients",
          value: "0",
          helper: "Requires backend doctor patient aggregate",
        },
        {
          title: "Pending prescriptions",
          value: "0",
          helper: "Requires backend prescription aggregate",
        },
        {
          title: "Profile completion",
          value: "0%",
          helper: "Requires backend profile completion field",
        },
      ],
      priorities: [
        "Review today's appointment list.",
        "Create pending prescriptions.",
        "Update profile details in backend.",
      ],
    };
  }

  return {
    source: "backend",
    metrics: [
      {
        title: "Upcoming appointments",
        value: String(appointmentCount),
        helper: "Loaded from backend appointment API",
      },
      {
        title: "Previous visits",
        value: "0",
        helper: "Requires backend visit history endpoint",
      },
      {
        title: "Prescriptions",
        value: "0",
        helper: "Requires backend patient prescription aggregate",
      },
      {
        title: "Payment status",
        value: "Unknown",
        helper: "Requires backend payment summary endpoint",
      },
    ],
    priorities: [
      "Confirm next appointment from backend.",
      "Review active prescriptions.",
      "Check payment status once backend summary is available.",
    ],
  };
}
