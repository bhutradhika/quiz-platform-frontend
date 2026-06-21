"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "@/hooks/useForm";
import { validateEmail, validatePassword } from "@/lib/validation";
import { LoginRequest } from "@/types";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginContent() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, isLoading, router]);

  const validate = (values: LoginRequest) => {
    const errors: Partial<Record<keyof LoginRequest, string>> = {};
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;
    const passwordError = validatePassword(values.password);
    if (passwordError) errors.password = passwordError;
    return errors;
  };

  const handleSubmit = async (values: LoginRequest) => {
    const result = await login(values);
    if (result.success) {
      resetForm();
      router.push("/dashboard");
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: onFormSubmit,
    resetForm,
  } = useForm<LoginRequest>({
    initialValues: { email: "", password: "" },
    validate,
    onSubmit: handleSubmit,
  });

  if (isLoading || isAuthenticated)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onFormSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                className={errors.email && touched.email ? "border-destructive" : ""}
                autoComplete="off"
              />
              {errors.email && touched.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange("password")}
                  onBlur={handleBlur("password")}
                  className={
                    errors.password && touched.password ? "border-destructive pr-10" : "pr-10"
                  }
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <Link href="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
