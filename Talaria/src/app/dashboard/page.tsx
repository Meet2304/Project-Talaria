"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to analytics page by default
    router.push("/dashboard/analytics");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-muted-foreground">Redirecting to Analytics...</div>
    </div>
  );
}

