export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
};

export type ApiResponse<T> = {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type ApiListResponse<T> = ApiResponse<T[]> & {
  meta?: ApiMeta;
};

export type AsyncStatus = "idle" | "loading" | "success" | "error";
