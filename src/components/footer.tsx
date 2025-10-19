import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-white py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center mb-6">
            <Image
              src="/images/logo.png"
              alt="Stachio Logo"
              width={40}
              height={40}
              className="h-10 mr-3"
              loading="lazy"
            />
            <span className="text-2xl font-bold">Stachio</span>
          </div>
          <p className="text-lg text-white/70 mb-6 max-w-md">
            The ultimate Discord bot for online safety and community protection,
            featuring advanced automod, moderation tools, anti-phishing
            protection, and comprehensive server management.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/discord"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-sm font-medium"
            >
              Join Discord
            </Link>
            <Link
              href="/invite"
              className="inline-flex items-center px-4 py-2 border border-white/20 hover:border-white/40 rounded-lg transition-colors text-sm font-medium"
            >
              Add to Server
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Navigation</h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/#features"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  Features
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/#commands"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  Commands
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/docs"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  Documentation
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/#testimonials"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  Testimonials
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Community</h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/discord"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  Discord Server
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/github"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  GitHub
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/support"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  Support Us
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Resources */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/privacy"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  Privacy Policy
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  Terms of Service
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/status"
                className="text-white/70 hover:text-white transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  Status Page
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm text-white/50">
        © {new Date().getFullYear()} Stachio. All rights reserved. • Not
        affiliated with Discord Inc.
      </div>
    </footer>
  );
}
