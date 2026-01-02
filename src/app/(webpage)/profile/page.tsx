"use client";

import { useState } from "react";
import { useGetProfileQuery } from "@/store/slices/authSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { data, isLoading, error } = useGetProfileQuery();
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if not logged in
  if (typeof window !== "undefined" && !localStorage.getItem("token")) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 pt-20">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 pt-20">
        <Card className="p-6 bg-white shadow-xl max-w-md w-full text-center">
          <p className="text-red-600 mb-4">Failed to load profile</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-black text-white hover:bg-gray-900 cursor-pointer"
          >
            Go Home
          </Button>
        </Card>
      </main>
    );
  }

  const user = data?.user;

  return (
    <main className="bg-gradient-to-br from-white via-gray-50 to-gray-100 px-4 pt-36 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Account Settings
        </h1>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar - Profile Summary */}
          <div className="lg:col-span-4">
            <Card className="p-6 bg-white shadow-lg sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {user?.name || "User"}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  {typeof user?.role === "string"
                    ? user.role
                    : user?.role?.name || "Customer"}
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {user?.isActive && (
                    <Badge className="bg-green-500 text-white text-xs">
                      Active
                    </Badge>
                  )}
                  {user?.isProfileCompleted && (
                    <Badge className="bg-blue-500 text-white text-xs">
                      Complete
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Email Verified</span>
                  {user?.isEmailVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phone Verified</span>
                  {user?.isPhoneVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-900">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Personal Information Card */}
            <Card className="bg-white shadow-lg">
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    Update your personal details
                  </p>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  size="sm"
                  variant={isEditing ? "default" : "outline"}
                  className={`cursor-pointer ${
                    isEditing ? "bg-black text-white hover:bg-gray-900" : ""
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      defaultValue={user?.name || ""}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {user?.name || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                    {user?.isEmailVerified && (
                      <Badge className="ml-2 bg-green-500 text-white text-[10px] px-1.5 py-0">
                        Verified
                      </Badge>
                    )}
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user?.email || "Not provided"}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                    {user?.isPhoneVerified && (
                      <Badge className="ml-2 bg-green-500 text-white text-[10px] px-1.5 py-0">
                        Verified
                      </Badge>
                    )}
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user?.phone || "Not provided"}
                  </p>
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Account Type
                  </label>
                  <p className="text-gray-900 font-medium capitalize">
                    {typeof user?.role === "string"
                      ? user.role
                      : user?.role?.name || "Customer"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
