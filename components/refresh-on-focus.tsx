"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DUPLICATE_EVENT_WINDOW_MS = 750;
const REFRESH_THROTTLE_MS = 10_000;

export function RefreshOnFocus() {
  const router = useRouter();

  useEffect(() => {
    let lastRefreshAt = 0;
    let lastVisibleEventAt = 0;
    let shouldRefreshOnReturn = false;

    function markAway() {
      shouldRefreshOnReturn = true;
    }

    function refreshWhenVisible(event: Event) {
      if (document.visibilityState !== "visible") {
        return;
      }

      const isRestoredPageShow = event.type === "pageshow" && "persisted" in event && event.persisted;

      if (!shouldRefreshOnReturn && !isRestoredPageShow) {
        return;
      }

      const now = Date.now();

      if (now - lastVisibleEventAt < DUPLICATE_EVENT_WINDOW_MS) {
        return;
      }

      lastVisibleEventAt = now;
      shouldRefreshOnReturn = false;

      if (now - lastRefreshAt < REFRESH_THROTTLE_MS) {
        return;
      }

      lastRefreshAt = now;
      router.refresh();
    }

    function handleVisibilityChange(event: Event) {
      if (document.visibilityState === "hidden") {
        markAway();
        return;
      }

      refreshWhenVisible(event);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", markAway);
    window.addEventListener("focus", refreshWhenVisible);
    window.addEventListener("pageshow", refreshWhenVisible);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", markAway);
      window.removeEventListener("focus", refreshWhenVisible);
      window.removeEventListener("pageshow", refreshWhenVisible);
    };
  }, [router]);

  return null;
}
