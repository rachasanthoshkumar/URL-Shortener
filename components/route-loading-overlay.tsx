import { Loader2 } from "lucide-react";

type RouteLoadingOverlayProps = {
  active?: boolean;
};

export function RouteLoadingOverlay({ active = true }: RouteLoadingOverlayProps) {
  return (
    <div
      aria-busy={active}
      aria-live="polite"
      className={[
        "fixed inset-0 z-[100] bg-white/10 backdrop-blur-[7px] transition-opacity duration-150",
        active ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      role="status"
    >
      <div className="flex min-h-full items-center justify-center px-6">
        <Loader2
          aria-hidden="true"
          className="animate-spin text-[#171717] drop-shadow-sm"
          size={34}
          strokeWidth={2.4}
        />
      </div>
      <span className="sr-only">Loading page</span>
    </div>
  );
}
