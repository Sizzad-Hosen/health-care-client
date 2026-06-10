export type DashboardMetric = {
  title: string;
  value: string;
  helper: string;
};

export type DashboardData = {
  metrics: DashboardMetric[];
  priorities: string[];
  source: "backend";
};

export type DashboardEntity = Record<string, unknown>;
