import * as React from "react";
import { cn } from "@/lib/utils";

function Alert({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900",
        className,
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h5">) {
  return <h5 className={cn("mb-1 font-medium", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-sm", className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };
