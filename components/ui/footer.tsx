export function Footer() {
  return (
    <footer className="w-full border-t mt-12 md:mt-20 border-neutral bg-background">
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
          © {new Date().getFullYear()} Mlabelle Beauty - Coiffure & Esthétique.
        </p>
      </div>
    </footer>
  );
}
