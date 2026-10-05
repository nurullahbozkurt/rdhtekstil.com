"use client";

import { domAnimation, LazyMotion, m, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** framer-motion'ı yalnızca gerekli özelliklerle yükler; `prefers-reduced-motion` ayarına uyar. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

/** Görünür alana girdiğinde içeriği yumuşakça gösterir. Ekranın üst kısmındaki (LCP) içerikte kullanmayın. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </m.div>
  );
}
