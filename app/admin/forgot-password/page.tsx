import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/admin/ForgotPasswordForm";
import { LoginBrandPanel } from "@/components/admin/LoginBrandPanel";

export const metadata: Metadata = {
  title: "Reset password — MultiCityExperts Admin",
};

export const dynamic = "force-dynamic";

export default function AdminForgotPasswordPage() {
  return (
    <div className="flex min-h-svh w-full bg-background">
      <LoginBrandPanel />
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
