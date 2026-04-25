"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import type { ReactNode } from "react";

export function NavigationWrappers({ children }: { children: ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const isBooking = segment === "booking";

  return (
    <>
      <Header variant={isBooking ? "booking" : "home"} />
      {children}
      <div className={isBooking ? "hidden md:block" : "w-full"}>
        <Footer />
      </div>
    </>
  );
}
