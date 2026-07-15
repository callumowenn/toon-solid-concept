import GlassPanel from "@/components/GlassPanel";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function PersonalisationWidget({ value, onChange }: Props) {
  const label =
    value < 25 ? "Citywide" : value < 60 ? "Balanced" : "For you";

  return (
    <GlassPanel as="section" className="w-[min(100%,300px)] rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wide text-ncc-muted">
          Personalisation
        </h2>
        <span className="rounded-full bg-solid-soft px-2 py-0.5 text-[11px] font-bold text-solid">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="w-12 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-ncc-muted">
          General
        </span>
        <input
          id="slider-personalisation"
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-solid w-full"
          aria-valuetext={label}
          aria-label="How personalised map suggestions should be"
        />
        <span className="w-14 shrink-0 text-right text-[10px] font-semibold uppercase tracking-wide text-ncc-muted">
          For you
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ncc-muted">
        Shapes which activities appear on the map using preferences from your
        Solid pod.
      </p>
    </GlassPanel>
  );
}
