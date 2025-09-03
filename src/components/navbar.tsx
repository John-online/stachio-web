"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react"; // Import Lucide icons

// Navigation links data
const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#commands", label: "Commands" },
  { href: "#testimonials", label: "Testimonials" },
];

const inviteBtn = {
  href: "/invite",
  label: "Add to Discord",
};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, y: -20, pointerEvents: "none" },
    visible: {
      opacity: 1,
      y: 0,
      pointerEvents: "auto",
      transition: { type: "spring" as const, stiffness: 400, damping: 30 },
    },
    exit: {
      opacity: 0,
      y: -20,
      pointerEvents: "none",
      transition: { duration: 0.2 },
    },
  };

  const handleMobileMenuToggle = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setMobileMenuOpen((open) => !open);
  };

  return (
    <motion.nav
      className="fixed w-full top-0 z-50 border-b backdrop-blur-md"
      style={{
        background: "var(--navbar-bg)",
        borderBottom: "1px solid var(--navbar-border)",
        backdropFilter: "var(--navbar-blur)",
      }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#hero" className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Image
                src="/images/logo.png"
                alt="Stachio Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg"
              />
            </motion.div>
            <motion.span
              className="text-2xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--navbar-logo-gradient-from), var(--navbar-logo-gradient-to))",
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Stachio
            </motion.span>
          </a>

          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="navbar-link"
                style={{ color: "var(--navbar-link)" }}
                whileHover={{ scale: 1.08 }}
                whileFocus={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          <a href={inviteBtn.href} className="hidden md:block">
            <motion.button
              className="btn-primary cursor-pointer"
            >
              {inviteBtn.label}
            </motion.button>
          </a>

          <motion.button
            onClick={handleMobileMenuToggle}
            className="md:hidden p-2"
            style={{ color: "var(--navbar-link)" }}
            aria-label="Menu"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobileMenu"
              className="md:hidden mt-2 rounded-lg p-4 space-y-2"
              style={{ background: "var(--navbar-mobile-bg)" }}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="block navbar-link"
                  style={{ color: "var(--navbar-link)" }}
                  onClick={() => setMobileMenuOpen(false)}
                  whileTap={{ scale: 0.97 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href={inviteBtn.href}
                className="block navbar-link"
                style={{ color: "var(--navbar-link)" }}
                onClick={() => setMobileMenuOpen(false)}
                whileTap={{ scale: 0.97 }}
              >
                {inviteBtn.label}
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
