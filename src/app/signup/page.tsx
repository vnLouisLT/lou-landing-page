import type { Metadata } from "next";
import { SignupForm } from "@/components/signup/signup-form";

export const metadata: Metadata = {
  title: "PLAYER ONE: CREATE ACCOUNT | NEON DRIVE '90",
};

export default function SignupPage() {
  return <SignupForm />;
}
