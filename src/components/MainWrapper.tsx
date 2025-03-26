"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/clerk/${clerkId}`
      );
      console.log("User details:", response.data);
      const { token, user } = response.data?.data || {};
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
