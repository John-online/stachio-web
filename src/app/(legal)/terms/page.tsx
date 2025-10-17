"use client";
import { Navbar } from "@/components/navbar";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Footer from "@/components/footer";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

export default function TermsPage() {
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/retrieve?file=/legal/terms.md")
      .then((res) => res.text())
      .then(setMarkdown)
      .catch(() => setMarkdown("Unable to load terms."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-[var(--hero-gradient-to)] py-24">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="feature-card p-10 rounded-2xl border border-white/10 shadow-xl bg-white/10">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <span className="ml-4 text-white/90">
                  Loading Terms of Service...
                </span>
              </div>
            ) : (
              <>
                <h1 className="text-5xl font-bold mb-8 text-center">
                  Terms of Service
                </h1>
                <h2 className="text-center text-white/70 mb-12">
                  Please read these terms carefully before using Stachio.
                </h2>
                <article className="prose prose-invert max-w-none text-white/90 space-y-8">
                  <ReactMarkdown
                    components={{
                      h2: ({ node, ...props }) => (
                        <h2
                          className="mt-10 mb-4 text-2xl font-semibold"
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-4" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="mb-4 list-disc list-inside" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="mb-1" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-white/30 pl-4 italic mb-4"
                          {...props}
                        />
                      ),
                    }}>
                    {markdown}
                  </ReactMarkdown>
                </article>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
