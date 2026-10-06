"use client";

import { useEffect } from "react";

/** Başarı sayfası mount olduktan sonra success cookie'yi temizler. */
export function ClearRequestSuccessCookie() {
  useEffect(() => {
    void fetch("/api/requests/success-ack", { method: "POST" });
  }, []);
  return null;
}
