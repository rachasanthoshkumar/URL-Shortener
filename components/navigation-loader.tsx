"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { RouteLoadingOverlay } from "@/components/route-loading-overlay";

const NAVIGATION_START_EVENT = "short-in:navigation-start";
const MIN_VISIBLE_MS = 650;
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
  const [isLoading, setIsLoading] = useState(false);
  const latestRouteKeyRef = useRef(routeKey);
  const startedAtRef = useRef(0);
  const startedRouteKeyRef = useRef(routeKey);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    latestRouteKeyRef.current = routeKey;
  }, [routeKey]);

  useEffect(() => {
    if (!isLoading || routeKey === startedRouteKeyRef.current) {
      return;
    }

    const elapsed = Date.now() - startedAtRef.current;
    const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);

    if (minTimerRef.current) {
      clearTimeout(minTimerRef.current);
    }

    minTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      minTimerRef.current = null;
    }, remaining);

    return () => {
      if (minTimerRef.current) {
        clearTimeout(minTimerRef.current);
        minTimerRef.current = null;
      }
    };
  }, [isLoading, routeKey]);

  useEffect(() => {
    function clearTimers() {
      if (maxTimerRef.current) {
        clearTimeout(maxTimerRef.current);
        maxTimerRef.current = null;
      }

      if (minTimerRef.current) {
        clearTimeout(minTimerRef.current);
        minTimerRef.current = null;
      }
    }

    function startLoading() {
      clearTimers();
      startedAtRef.current = Date.now();
      startedRouteKeyRef.current = latestRouteKeyRef.current;
      setIsLoading(true);
      maxTimerRef.current = setTimeout(() => {
        setIsLoading(false);
        maxTimerRef.current = null;
      }, MAX_VISIBLE_MS);
    }

    function handlePointerDown(event: PointerEvent) {
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

    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") {
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
    window.addEventListener("popstate", startLoading);
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      clearTimers();
      window.removeEventListener(NAVIGATION_START_EVENT, startLoading);
      window.removeEventListener("popstate", startLoading);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown, true);
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
