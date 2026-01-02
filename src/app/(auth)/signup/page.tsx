"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useCompleteProfileMutation,
} from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"identifier" | "otp" | "profile">(
    "identifier"
  );
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [sendOTP, { isLoading: isSendingOTP }] = useSendOTPMutation();
  const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();
  const [completeProfile, { isLoading: isCompletingProfile }] =
    useCompleteProfileMutation();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOTP({ identifier, purpose: "signup" }).unwrap();
      setStep("otp");
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
        purpose: "signup",
      }).unwrap();
      console.log("OTP verified:", result);
      // Check if profile is completed
      if (result.accessToken) {
        setStep("profile");
      }
    } catch (error: any) {
      alert(error?.data?.message || "Invalid OTP");
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await completeProfile({ name, password }).unwrap();
      alert("Registration successful!");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      alert(error?.data?.message || "Failed to complete profile");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 pt-20">
      <Card className="w-full max-w-md p-8 bg-white shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join BroyalHides today</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === "identifier" || step === "otp" || step === "profile"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div
              className={`w-12 h-1 ${
                step === "otp" || step === "profile"
                  ? "bg-black"
                  : "bg-gray-200"
              }`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === "otp" || step === "profile"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <div
              className={`w-12 h-1 ${
                step === "profile" ? "bg-black" : "bg-gray-200"
              }`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === "profile"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              3
            </div>
          </div>
        </div>

        {/* Step 1: Identifier */}
        {step === "identifier" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Phone Number
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
                "Continue"
              )}
            </Button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
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
              onClick={() => setStep("identifier")}
              className="w-full cursor-pointer"
            >
              Back
            </Button>
          </form>
        )}

        {/* Step 3: Complete Profile */}
        {step === "profile" && (
          <form onSubmit={handleCompleteProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
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
                placeholder="Create a password"
                required
                minLength={6}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                minLength={6}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isCompletingProfile}
              className="w-full bg-black text-white hover:bg-gray-800 cursor-pointer"
            >
              {isCompletingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-black font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </main>
  );
}
