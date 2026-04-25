import { Logo } from "@/components/ui/logo";
import Link from "next/link";

interface HeaderProps {
  variant?: "home" | "booking";
}

export function Header({ variant = "home" }: HeaderProps) {
  return (
    <nav className="w-full bg-background/95 backdrop-blur-md border-b border-outline-variant/20 sticky top-0 z-50">
      {/* Desktop Header */}
      <div className={`justify-between items-center w-full px-gutter md:px-xxl py-4 md:py-6 max-w-[1440px] mx-auto ${variant === "booking" ? "hidden md:flex" : "flex"}`}>
        <Logo />

        <div className="flex items-center gap-xl">
          <Link href="/services" className="hidden lg:block label-caps text-[11px] text-foreground hover:text-secondary transition-colors">
            SERVICES
          </Link>
          <Link href="/contact" className="hidden lg:block label-caps text-[11px] text-foreground hover:text-secondary transition-colors">
            CONTACT
          </Link>
          <button className="bg-foreground text-white label-caps px-xl py-3 hover:bg-neutral transition-all duration-300 shadow-md">
            RÉSERVER
          </button>
        </div>
      </div>

      {/* Booking Mobile Header - Matched to Screenshot 2 */}
      {variant === "booking" && (
        <div className="flex md:hidden justify-between items-center w-full px-gutter py-4">
          <Link href="/" className="text-foreground p-2 -ml-2" aria-label="Retour">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </Link>
          <span className="font-serif text-[16px] tracking-[0.2em] uppercase text-foreground">
            MLABELLE BEAUTY
          </span>
          <button className="text-foreground p-2 -mr-2" aria-label="Profil">
            <span className="material-symbols-outlined text-[24px]">person</span>
          </button>
        </div>
      )}
    </nav>
  );
}
