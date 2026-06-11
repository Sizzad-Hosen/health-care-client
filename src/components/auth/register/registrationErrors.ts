type ApiErrorPayload = {
  data?: {
    message?: string;
  };
  error?: string;
};

export function getRegistrationErrorMessage(error: unknown) {
  const apiError = error as ApiErrorPayload;

  return (
    apiError.data?.message ??
    apiError.error ??
    "Account creation failed. Check the details and try again."
  );
}
