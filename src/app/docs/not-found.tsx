import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Home, FileText } from "lucide-react";

export default function DocsNotFound() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <FileText size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Documentation Not Found
            </h1>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              The documentation page you&apos;re looking for doesn&apos;t exist.
              It may have been moved, renamed, or deleted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/docs"
                className="btn-primary flex items-center justify-center"
              >
                <Home size={20} className="mr-2" />
                All Documentation
              </Link>
              <Link
                href="/"
                className="btn-secondary flex items-center justify-center"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
