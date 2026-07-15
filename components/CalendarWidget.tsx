'use client';

import GlassPanel from '@/components/GlassPanel';
import {
  calendarDays,
  listingIsoDate,
  type CityListing,
} from '@/data/mockOurToon';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

type Props = {
  selectedDates: string[];
  onChange: (dates: string[]) => void;
  listings: CityListing[];
};

function rangeIso(a: string, b: string) {
  const start = a < b ? a : b;
  const end = a < b ? b : a;
  const out: string[] = [];
  const cur = new Date(`${start}T12:00:00`);
  const last = new Date(`${end}T12:00:00`);
  while (cur <= last) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    out.push(`${y}-${m}-${d}`);
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

function densityWidth(count: number) {
  if (count <= 0) return 0;
  if (count === 1) return 7;
  return Math.min(30, 7 + (count - 1) * 5);
}

export default function CalendarWidget({
  selectedDates,
  onChange,
  listings,
}: Props) {
  /** Today is the leftmost day; scroll forward for upcoming dates */
  const days = useMemo(() => calendarDays(undefined, 0, 28), []);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<string | null>(null);
  const dragPreviewRef = useRef<string[]>([]);
  const onChangeRef = useRef(onChange);
  const [dragging, setDragging] = useState(false);
  const [dragPreview, setDragPreview] = useState<string[]>([]);

  onChangeRef.current = onChange;

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const listing of listings) {
      const iso = listingIsoDate(listing);
      if (!iso) continue;
      map.set(iso, (map.get(iso) ?? 0) + 1);
    }
    return map;
  }, [listings]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = 0;
  }, []);

  useEffect(() => {
    if (!dragging || !dragStartRef.current) return;

    function dayFromPoint(clientX: number, clientY: number) {
      const hit = document.elementFromPoint(clientX, clientY);
      return hit?.closest<HTMLElement>('[data-cal-iso]')?.dataset.calIso ?? null;
    }

    function onMove(e: PointerEvent) {
      const iso = dayFromPoint(e.clientX, e.clientY);
      if (!iso || !dragStartRef.current) return;
      const next = rangeIso(dragStartRef.current, iso);
      dragPreviewRef.current = next;
      setDragPreview(next);
    }

    function onUp(e: PointerEvent) {
      const iso =
        dayFromPoint(e.clientX, e.clientY) ??
        dragPreviewRef.current[dragPreviewRef.current.length - 1] ??
        dragStartRef.current;
      const start = dragStartRef.current;
      dragStartRef.current = null;
      setDragging(false);
      if (start && iso) {
        onChangeRef.current([...new Set(rangeIso(start, iso))].sort());
      }
      dragPreviewRef.current = [];
      setDragPreview([]);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [dragging]);

  function commitSelection(next: string[]) {
    onChangeRef.current([...new Set(next)].sort());
  }

  function handlePointerDown(
    e: ReactPointerEvent<HTMLButtonElement>,
    iso: string,
  ) {
    e.preventDefault();
    if (e.metaKey || e.ctrlKey) {
      const has = selectedDates.includes(iso);
      commitSelection(
        has
          ? selectedDates.filter((d) => d !== iso)
          : [...selectedDates, iso],
      );
      return;
    }
    dragStartRef.current = iso;
    dragPreviewRef.current = [iso];
    setDragging(true);
    setDragPreview([iso]);
  }

  function clearSelection() {
    commitSelection([]);
  }

  return (
    <GlassPanel
      as="section"
      className="w-[min(100vw-1.5rem,340px)] rounded-2xl p-3"
      aria-label="Calendar"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-[10px] font-bold uppercase tracking-wide text-ncc-muted">
          Calendar
        </h2>
        {selectedDates.length > 0 ? (
          <button
            type="button"
            onClick={clearSelection}
            className="cursor-pointer text-[10px] font-semibold text-solid hover:underline"
          >
            Clear
          </button>
        ) : (
          <span className="text-[10px] font-medium text-ncc-muted/80">
            Drag or ⌘-click
          </span>
        )}
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-1 overflow-x-auto pb-0.5 [scrollbar-width:thin] select-none"
      >
        {days.map((day) => {
          const count = counts.get(day.iso) ?? 0;
          const committed = selectedDates.includes(day.iso);
          const previewing = dragPreview.includes(day.iso);
          const barW = densityWidth(count);

          return (
            <button
              key={day.iso}
              type="button"
              data-cal-iso={day.iso}
              data-today={day.isToday ? 'true' : undefined}
              onPointerDown={(e) => handlePointerDown(e, day.iso)}
              className={`flex w-10 shrink-0 flex-col items-center rounded-xl px-0.5 py-1.5 transition ${
                previewing
                  ? 'bg-black/50 text-white ring-2 ring-black/15'
                  : committed
                    ? 'bg-black/65 text-white'
                    : day.isToday
                      ? 'bg-black/12 text-ncc-ink'
                      : 'bg-black/4 text-ncc-ink hover:bg-black/8'
              }`}
              aria-pressed={committed || previewing}
              aria-label={`${day.short} ${day.day} ${day.month}${count ? `, ${count} activities` : ''}`}
            >
              <span
                className={`text-[9px] font-semibold ${
                  previewing || committed ? 'text-white/70' : 'text-ncc-muted'
                }`}
              >
                {day.short}
              </span>
              <span className="text-sm font-bold leading-none">{day.day}</span>
              <span className="mt-1 flex h-1.5 w-full items-center justify-center">
                {barW > 0 ? (
                  <span
                    className={`block h-1.5 rounded-full ${
                      previewing || committed
                        ? 'bg-white/85'
                        : 'bg-ncc-ink/45'
                    }`}
                    style={{ width: barW }}
                    aria-hidden
                  />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </GlassPanel>
  );
}
