'use client';

import { Logo } from "@/components/ui/logo";
import { useRouter } from "next/navigation";
import { CatalogScrollButton } from "@/components/ui/services/catalog-scroll-button";

interface HeaderProps {
  variant?: "home" | "booking";
}

export function Header({ variant = "home" }: HeaderProps) {
  const router = useRouter();

  return (
    <nav className="w-full bg-background/95 backdrop-blur-md border-b border-outline-variant/20 sticky top-0 z-50">
      {/* Desktop Header */}
      <div className={`justify-between items-center w-full px-gutter md:px-xxl py-4 md:py-6 max-w-[1440px] mx-auto ${variant === "booking" ? "hidden md:flex" : "flex"}`}>
        <Logo size="md" priority />

        {variant !== "booking" && (
          <div className="flex items-center gap-xl">
            <CatalogScrollButton size="sm" className="shadow-md">
              RÉSERVER
            </CatalogScrollButton>
          </div>
        )}
      </div>

      {/* Booking Mobile Header - Matched to Screenshot 2 */}
      {variant === "booking" && (
        <div className="flex md:hidden items-center w-full px-gutter py-3">
          <button onClick={() => router.back()} className="text-foreground p-1 -ml-2 mt-1" aria-label="Retour">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <Logo size="xs" priority />
        </div>
      )}
    </nav>
  );
}
