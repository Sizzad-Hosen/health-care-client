"use client";

import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  return (
    <Card>
      <CardContent className="p-6">
        {sent ? (
          <Alert>
            <MailCheck className="h-4 w-4" />
            <AlertTitle>Reset instructions sent</AlertTitle>
            <AlertDescription>
              Check your inbox for the next step. This demo does not send real
              email.
            </AlertDescription>
          </Alert>
        ) : null}

        <Form
          className="mt-4 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" required placeholder="you@healthcare.com" />
            </FormControl>
          </FormItem>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </Form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Remember password?{" "}
          <Link className="font-medium text-emerald-700" href="/login">
            Back to login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
