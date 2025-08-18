import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import useForm from "@/hooks/use-form";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isSigningUp, signUp, passwordError, clearPasswordError } =
    useAuthStore();
  const { formData, handleChange } = useForm(
    {
      username: "",
      email: "",
      password: "",
    },
    (name) => {
      if (name === "email") {
        setEmailError("");
      }
      if (name === "password") {
        clearPasswordError();
      }
    }
  );

  function handleValidation() {
    if (!/^[^\s@]+@[^\s@]+\.(com)$/.test(formData.email)) {
      setEmailError("Invalid email format.");
      return false;
    }

    return true;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const success = handleValidation();

    if (success) {
      signUp(formData, navigate);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Full Name</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  placeholder="eg.Juan De la Cruz"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  placeholder="m@example.com"
                  required
                  onChange={handleChange}
                />
                {emailError && (
                  <span className="text-red-600 text-sm -mt-3 ml-1">
                    {emailError}
                  </span>
                )}
              </div>
              <div className="grid gap-3 relative">
                <Label htmlFor="password">Password</Label>

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  required
                  onChange={handleChange}
                />
                <span
                  className="absolute top-8.5 right-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5 text-gray-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-600" />
                  )}
                </span>
                {passwordError && (
                  <span className="text-red-600 text-sm -mt-3 ml-1">
                    {passwordError}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isSigningUp}>
                  {isSigningUp && (
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  )}
                  Sign up
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/admin/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
