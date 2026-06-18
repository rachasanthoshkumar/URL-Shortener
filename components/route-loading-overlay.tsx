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
        "fixed inset-0 z-[100] bg-white/45 backdrop-blur-[3px] transition-opacity duration-150",
        active ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      role="status"
    >
      <div className="flex min-h-full items-center justify-center px-6">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-black text-white shadow-xl shadow-black/20">
          <Loader2 aria-hidden="true" className="animate-spin" size={26} />
        </div>
      </div>
      <span className="sr-only">Loading page</span>
    </div>
  );
}
