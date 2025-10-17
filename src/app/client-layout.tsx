"use client";
import { Loader } from "@/components/loader";
import { useState, useEffect } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadingComplete = () => {
    setShowContent(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {" "}
      <Loader
        isLoading={isLoading}
        onLoadingComplete={handleLoadingComplete}
      />{" "}
      <div
        className={`transition-opacity duration-500 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}>
        {" "}
        {children}{" "}
      </div>{" "}
    </>
  );
}
