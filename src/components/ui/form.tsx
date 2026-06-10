"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const Form = ({ children, ...props }: React.ComponentProps<"form">) => (
  <form {...props}>{children}</form>
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label className={className} {...props} />;
}

function FormControl({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={className} {...props} />;
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  if (!children) {
    return null;
  }

  return (
    <p className={cn("text-sm font-medium text-red-600", className)} {...props}>
      {children}
    </p>
  );
}

export { Form, FormControl, FormItem, FormLabel, FormMessage };
