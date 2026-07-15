import GlassPanel from "@/components/GlassPanel";
import { upcomingWeek } from "@/data/mockOurToon";

export default function WeekWidget() {
  const freeDays = upcomingWeek.filter((d) => d.free).map((d) => d.short);

  return (
    <GlassPanel as="section" className="w-[min(100%,320px)] rounded-2xl p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wide text-ncc-muted">
          Your week
        </h2>
        <p className="text-[11px] font-medium text-solid">From Solid calendar</p>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {upcomingWeek.map((day) => (
          <div
            key={day.key}
            className={`flex flex-col items-center rounded-xl px-0.5 py-2 ${
              day.free
                ? "bg-emerald-500/12 ring-1 ring-emerald-600/20"
                : "bg-black/[0.04]"
            }`}
            title={day.note}
          >
            <span className="text-[10px] font-semibold text-ncc-muted">
              {day.short}
            </span>
            <span
              className={`mt-1 size-2 rounded-full ${
                day.free ? "bg-emerald-600" : "bg-zinc-300"
              }`}
              aria-hidden
            />
            <span className="mt-1 text-[9px] font-medium leading-none text-ncc-ink/70">
              {day.free ? "Free" : "Busy"}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ncc-muted">
        You look free on{" "}
        <span className="font-semibold text-ncc-ink">
          {freeDays.join(", ")}
        </span>
        — good windows for clubs and events nearby.
      </p>
    </GlassPanel>
  );
}
