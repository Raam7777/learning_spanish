import { redirect } from "next/navigation";
import { AuthFrame } from "@/components/auth-frame";
import { getSessionUser } from "@/lib/auth";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (user) redirect("/");

  return <AuthFrame>{children}</AuthFrame>;
}
