"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet } from "@/lib/api";

interface MainWrapperProps {
  children: React.ReactNode;
}

export function MainWrapper({ children }: MainWrapperProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {}, []);

  useEffect(() => {
    console.log("clerk user : ", user);

    if (user?.id) {
      getUserDetails(user.id);
    }
  }, [isSignedIn, user]);

  const getUserDetails = async (clerkId: string) => {
    try {
      const data = await apiGet<{ data: { token: string; user: any } }>(
        `/api/users/clerk/${clerkId}`
      );
      console.log("User details V2:", data);
      const { token, user } = data?.data || {};

      if (user) {
        const combinedUser = { ...user, token };
        localStorage.setItem("currentUser", JSON.stringify(combinedUser));
      }
    } catch (error: unknown) {
      console.error("Error fetching User details:", error);
      toast.error("Failed to fetch User details. Please try again.");
      return null;
    }
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      localStorage.removeItem("currentUser");
    }
  }, [isSignedIn, isLoaded]);

  return <main className="pt-24">{children}</main>;
}
