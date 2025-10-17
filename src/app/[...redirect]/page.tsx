"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import redirects from "@/assets/redirects.json";

export default function Redirect() {
  const params = useParams();

  useEffect(() => {
    const redirectPath = params.redirect?.[0];

    if (
      redirectPath &&
      redirects[`/${redirectPath}` as keyof typeof redirects]
    ) {
      window.location.href =
        redirects[`/${redirectPath}` as keyof typeof redirects];
    } else {
      window.location.href = "/";
    }
  }, [params]);

  return (
    "Sending you to " +
    (redirects[`/${params.redirect?.[0]}` as keyof typeof redirects] || "/")
  );
}
