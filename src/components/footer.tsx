import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-white py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-12">
        <div>
          <Image
            src="/images/logo.png"
            alt="Stachio Logo"
            width={40}
            height={40}
            className="h-10 mb-6"
            loading="lazy"
          />
          <p className="text-lg text-white/70">
            Stachio is the ultimate bot for online safety and community
            protection, with automod, moderation, anti-phishing, and more.
          </p>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="text-white/70 hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/#features"
                className="text-white/70 hover:text-white transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link
                href="/#commands"
                className="text-white/70 hover:text-white transition-colors">
                Commands
              </Link>
            </li>
            <li>
              <Link
                href="/#testimonials"
                className="text-white/70 hover:text-white transition-colors">
                Testimonials
              </Link>
            </li>
            <li>
              <Link
                href="privacy"
                className="text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="terms"
                className="text-white/70 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/invite"
                className="text-white/70 hover:text-white transition-colors">
                Invite
              </Link>
            </li>
            <li>
              <Link
                href="/discord"
                className="text-white/70 hover:text-white transition-colors">
                Discord
              </Link>
            </li>
            <li>
              <Link
                href="/github"
                className="text-white/70 hover:text-white transition-colors">
                GitHub
              </Link>
            </li>
            <li>
              <Link
                href="/support"
                className="text-white/70 hover:text-white transition-colors">
                Support Us
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
