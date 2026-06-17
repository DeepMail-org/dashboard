import { redirect } from "next/navigation";

export default function SandboxRootPage() {
  redirect("/sandbox/overview");
}
