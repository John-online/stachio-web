"use client";
import { Navbar } from "@/components/navbar";
import { DocsSidebar } from "@/components/docs-sidebar";
import { usePathname } from "next/navigation";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);
  const currentCategory = pathParts[1];
  const currentSlug = pathParts.slice(2);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--background)]">
        {currentCategory ? (
          <div className="flex">
            <DocsSidebar
              currentCategory={currentCategory}
              currentSlug={currentSlug.length > 0 ? currentSlug : undefined}
            />
            <main
              className="flex-1 min-w-0"
              style={{
                marginTop: "42px",
              }}
            >
              {children}
            </main>
          </div>
        ) : (
          <main>{children}</main>
        )}
      </div>
    </>
  );
}
