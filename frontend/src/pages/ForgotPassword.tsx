import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Forgot your password?</CardTitle>
            <CardDescription>
              Please enter the email address associated with your account and we
              will email you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled={status === "loading"}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setStatus("idle");
                    }}
                    required
                  />
                </Field>
                <Field>
                  {status === "error" && (
                    <p className="text-red-500 text-sm">
                      Something went wrong, please try again.
                    </p>
                  )}
                  {status === "loading" && (
                    <p className="text-gray-500 text-sm">
                      Sending reset link...
                    </p>
                  )}
                  {status === "sent" && (
                    <p className="text-gray-500 text-sm">
                      If an account exists for this email, a reset link has been
                      sent.
                    </p>
                  )}
                </Field>
                <Field>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={status === "loading"}
                  >
                    Confirm
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
