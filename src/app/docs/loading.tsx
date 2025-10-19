import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

export default function DocsLoading() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#aac49b] mx-auto"></div>
            <p className="text-white/70 mt-4">Loading documentation...</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
