import type { ReactNode } from "react";
import { NavigationWrappers } from "@/components/layout/navigation-wrappers";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-screen font-sans antialiased flex flex-col">
      <NavigationWrappers>
        {children}
      </NavigationWrappers>
    </div>
  );
}
