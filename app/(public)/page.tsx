import { getActiveServices } from "@/features/services/queries";
import { formatPrice, formatDuration } from "@/features/booking/utils";
import { format } from "date-fns";
import Link from "next/link";

export const revalidate = 3600;

export default async function HomePage() {
  const services = await getActiveServices();
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="bg-background text-foreground min-h-screen font-sans antialiased flex flex-col">
      {/* Top Navbar */}
      <nav className="w-full bg-surface border-b border-neutral sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 md:px-20 py-4 md:py-6 max-w-[1440px] mx-auto">
          {/* Logo */}
          <div className="flex flex-col items-start">
            <h1 className="text-lg md:text-2xl font-serif md:font-light tracking-[0.2em] md:tracking-tighter uppercase md:normal-case text-foreground">
              Mlabelle Beauty
            </h1>
            <div className="h-px w-8 bg-secondary mt-1 md:hidden" />
          </div>

          <button className="bg-tertiary text-white label-caps px-6 py-2 md:py-3 rounded md:rounded-none hover:bg-secondary md:hover:bg-tertiary/90 transition-all duration-300">
            Réserver
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 md:px-[80px] py-[48px] md:py-[80px]">
        {/* Header Section */}
        <header className="text-center mb-[48px] md:mb-[80px] max-w-2xl mx-auto">
          <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.2] md:leading-[1.3] text-foreground mb-2 md:mb-4 tracking-[-0.01em] md:tracking-[-0.02em]">
            Nos Prestations
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] text-foreground/80 leading-[1.6]">
            L'art de la beauté à la française. Découvrez nos rituels de soins sur mesure.
          </p>
        </header>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-[24px]">
          {services.map((service) => (
            <article
              key={service.id}
              className="bg-surface border border-secondary/20 md:border-secondary/30 rounded-lg md:rounded-none flex flex-col group hover:border-secondary/60 md:hover:border-secondary transition-colors duration-300 md:duration-500 p-6 md:p-[48px] shadow-sm md:shadow-none hover:shadow md:hover:shadow-none"
            >
              <div className="mb-4 md:mb-6">
                <span className="font-sans text-[11px] md:text-[12px] tracking-[0.2em] md:tracking-[0.15em] text-secondary border border-secondary/40 md:border-none px-3 md:px-0 py-1.5 md:py-0 rounded-full md:rounded-none uppercase font-semibold">
                  PRESTATION
                </span>
              </div>

              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex justify-between items-start mb-2 md:mb-4">
                    <h3 className="font-serif text-[24px] text-foreground leading-[1.4]">
                      {service.name}
                    </h3>
                    {/* Mobile Price */}
                    <span className="md:hidden font-serif text-[24px] text-secondary whitespace-nowrap">
                      {formatPrice(service.price_cents)}
                    </span>
                  </div>
                  {/* Optional Description */}
                  {service.description && (
                    <p className="font-sans text-[16px] text-foreground/80 mb-6 md:mb-[48px] md:w-full flex-grow leading-[1.6]">
                      {service.description}
                    </p>
                  )}
                </div>

                {/* Bottom Info & Button */}
                <div className="flex items-center md:items-stretch md:flex-col justify-between mt-auto pt-4 md:pt-[24px] border-t border-secondary/20">
                  <div className="flex justify-between items-center w-auto md:w-full mb-0 md:mb-[24px]">
                    <span className="font-sans text-[16px] md:text-[12px] text-foreground/80 md:font-semibold md:uppercase md:tracking-[0.15em]">
                      {formatDuration(service.duration_minutes)}
                    </span>
                    {/* Desktop Price */}
                    <span className="hidden md:block font-sans text-[18px] font-medium text-foreground">
                      {formatPrice(service.price_cents)}
                    </span>
                  </div>

                  {/* Responsive Button */}
                  <Link
                    href={`/booking/${today}?service_id=${service.id}`}
                    className="ml-4 md:ml-0 bg-tertiary text-white font-sans text-[12px] font-semibold tracking-[0.15em] uppercase px-4 py-2 md:py-4 md:w-full rounded md:rounded-none hover:bg-secondary md:hover:bg-tertiary/90 transition-colors duration-300 text-center"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t mt-12 md:mt-20 border-neutral bg-surface">
        <div className="flex flex-col items-center gap-8 w-full px-6 md:px-20 py-12 text-center max-w-[1440px] mx-auto">
          <div className="font-serif text-lg font-medium text-foreground">
            Mlabelle Beauty
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="font-serif text-xs tracking-widest uppercase text-foreground/60 hover:text-secondary transition-colors duration-200 ease-in-out" href="#">
              Mentions Légales
            </a>
            <a className="font-serif text-xs tracking-widest uppercase text-foreground/60 hover:text-secondary transition-colors duration-200 ease-in-out" href="#">
              Confidentialité
            </a>
            <a className="font-serif text-xs tracking-widest uppercase text-foreground/60 hover:text-secondary transition-colors duration-200 ease-in-out" href="#">
              Instagram
            </a>
            <a className="font-serif text-xs tracking-widest uppercase text-foreground/60 hover:text-secondary transition-colors duration-200 ease-in-out" href="#">
              Prendre Rendez-vous
            </a>
          </div>
          <p className="font-sans text-[16px] text-foreground/80 text-sm leading-[1.6]">
            © {new Date().getFullYear()} Mlabelle Beauty - Coiffure & Esthétique. L'art de la beauté à la française.
          </p>
        </div>
      </footer>
    </div>
  );
}
