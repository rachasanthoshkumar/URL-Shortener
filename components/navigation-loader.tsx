"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { RouteLoadingOverlay } from "@/components/route-loading-overlay";

const NAVIGATION_START_EVENT = "short-in:navigation-start";
const MAX_VISIBLE_MS = 8000;

export function startRouteLoading() {
  window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
}

export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = useMemo(
    () => `${pathname}?${searchParams.toString()}`,
    [pathname, searchParams],
  );
  const [pendingRouteKey, setPendingRouteKey] = useState<string | null>(null);
  const latestRouteKeyRef = useRef(routeKey);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoading = pendingRouteKey === routeKey;

  useEffect(() => {
    latestRouteKeyRef.current = routeKey;
  }, [routeKey]);

  useEffect(() => {
    function clearSafetyTimeout() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function startLoading() {
      clearSafetyTimeout();
      setPendingRouteKey(latestRouteKeyRef.current);
      timeoutRef.current = setTimeout(() => {
        setPendingRouteKey(null);
        timeoutRef.current = null;
      }, MAX_VISIBLE_MS);
    }

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || shouldSkipLink(anchor)) {
        return;
      }

      startLoading();
    }

    window.addEventListener(NAVIGATION_START_EVENT, startLoading);
    document.addEventListener("click", handleClick, true);

    return () => {
      clearSafetyTimeout();
      window.removeEventListener(NAVIGATION_START_EVENT, startLoading);
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return <RouteLoadingOverlay active={isLoading} />;
}

function shouldSkipLink(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== "_self") {
    return true;
  }

  if (anchor.hasAttribute("download")) {
    return true;
  }

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return true;
  }

  const nextUrl = new URL(anchor.href);
  const currentUrl = new URL(window.location.href);

  if (nextUrl.origin !== currentUrl.origin) {
    return true;
  }

  return nextUrl.pathname === currentUrl.pathname && nextUrl.search === currentUrl.search;
}
