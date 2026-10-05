"use client";

import type { ComponentProps } from "react";
import { track } from "@/lib/analytics/events";

type Props = ComponentProps<"a"> & {
  event: "whatsapp_click" | "email_click";
  location: string;
};

/** WhatsApp / e-posta bağlantısı; tıklamada (onay varsa) dataLayer event'i gönderir. */
export function TrackedLink({ event, location, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, { location });
        onClick?.(e);
      }}
    />
  );
}
