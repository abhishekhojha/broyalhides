"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useLoginMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
} from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">(
    "password"
  );
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [sendOTP, { isLoading: isSendingOTP }] = useSendOTPMutation();
  const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ identifier, password }).unwrap();
      console.log("Login successful:", result);
      router.push("/");
      router.refresh();
    } catch (error: any) {
      alert(
        error?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOTP({ identifier, purpose: "login" }).unwrap();
      setOtpSent(true);
      alert("OTP sent to your email/phone");
    } catch (error: any) {
      alert(error?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await verifyOTP({
        identifier,
        otp,
        purpose: "login",
      }).unwrap();
      console.log("OTP verified:", result);
      router.push("/");
      router.refresh();
    } catch (error: any) {
      alert(error?.data?.message || "Invalid OTP");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 pt-20">
      <Card className="w-full max-w-md p-8 bg-white shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={loginMethod === "password" ? "default" : "outline"}
            className={`flex-1 cursor-pointer ${
              loginMethod === "password" ? "bg-black text-white" : ""
            }`}
            onClick={() => {
              setLoginMethod("password");
              setOtpSent(false);
            }}
          >
            Password
          </Button>
          <Button
            type="button"
            variant={loginMethod === "otp" ? "default" : "outline"}
            className={`flex-1 cursor-pointer ${
              loginMethod === "otp" ? "bg-black text-white" : ""
            }`}
            onClick={() => {
              setLoginMethod("otp");
              setOtpSent(false);
            }}
          >
            OTP
          </Button>
        </div>

        {/* Password Login Form */}
        {loginMethod === "password" && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Phone
              </label>
              <Input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or phone"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-black text-white hover:bg-gray-800 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        )}

        {/* OTP Login Form */}
        {loginMethod === "otp" && !otpSent && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Phone
              </label>
              <Input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or phone"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isSendingOTP}
              className="w-full bg-black text-white hover:bg-gray-800 cursor-pointer"
            >
              {isSendingOTP ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        )}

        {/* OTP Verification Form */}
        {loginMethod === "otp" && otpSent && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 4-digit OTP"
                required
                maxLength={4}
                className="w-full text-center text-2xl tracking-widest"
              />
              <p className="text-sm text-gray-500 mt-2">
                OTP sent to {identifier}
              </p>
            </div>

            <Button
              type="submit"
              disabled={isVerifyingOTP}
              className="w-full bg-black text-white hover:bg-gray-800 cursor-pointer"
            >
              {isVerifyingOTP ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setOtpSent(false)}
              className="w-full cursor-pointer"
            >
              Resend OTP
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-black font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </main>
  );
}
