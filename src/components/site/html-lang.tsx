"use client";

import { useEffect } from "react";

/** Kök `<html lang>` değerini locale layout'tan günceller. */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
