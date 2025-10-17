"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LoaderProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
}

export function Loader({ isLoading, onLoadingComplete }: LoaderProps) {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoader(false);
        onLoadingComplete();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isLoading, onLoadingComplete]);

  if (!showLoader) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0f1419] via-[#1a2332] to-[#243447] transition-opacity duration-800 ${
        !isLoading ? "opacity-0" : "opacity-100"
      }`}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#aac49b]/10 via-transparent to-[#aac49b]/5"></div>
      </div>

      <div className="relative mb-12">
        <div className="absolute inset-0 w-32 h-32 bg-[#aac49b]/20 rounded-full blur-xl animate-pulse"></div>
      </div>

      <span className="text-white/70 text-lg font-medium">Loading...</span>
    </div>
  );
}
