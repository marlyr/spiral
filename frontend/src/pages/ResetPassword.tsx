import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmedPassword) {
      setError("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setError("Something went wrong");
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="password">New Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmed-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmed-password"
                    type="password"
                    value={confirmedPassword}
                    onChange={(e) => setConfirmedPassword(e.target.value)}
                    required
                  />
                </Field>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Field>
                  <Button type="submit" className="w-full">
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
