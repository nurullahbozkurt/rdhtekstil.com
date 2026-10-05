"use client";

import { useEffect } from "react";
import { track, type AnalyticsEventName, type AnalyticsEvents } from "@/lib/analytics/events";

/** Sayfa görüntüleme event'i (ör. `view_product`). Onay yoksa hiçbir şey göndermez. */
export function TrackEvent<E extends AnalyticsEventName>({
  event,
  params,
}: {
  event: E;
  params?: AnalyticsEvents[E];
}) {
  const key = JSON.stringify(params ?? {});
  useEffect(() => {
    track(event, JSON.parse(key) as AnalyticsEvents[E]);
  }, [event, key]);
  return null;
}
