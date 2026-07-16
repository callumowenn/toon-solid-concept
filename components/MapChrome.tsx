'use client';

import ActivityFilters from '@/components/ActivityFilters';
import GlassPanel from '@/components/GlassPanel';
import type { SolidShareResult } from '@/components/SolidShareModal';
import {
  CATEGORY_LEGEND,
  mockPodProfile,
  retentionOptions,
  type ActivityFilterState,
  type ListingCategory,
} from '@/data/mockOurToon';
import { CATEGORY_FA_ICON } from '@/lib/categoryIcons';
import { SOLID_CATEGORY_ICONS } from '@/lib/solidDataIcons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import { ClockIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

type Props = {
  solidConnected: boolean;
  solidShare: SolidShareResult | null;
  onConnectClick: () => void;
  onCreateEventClick?: () => void;
  filters: ActivityFilterState;
  onFiltersChange: (next: ActivityFilterState) => void;
};

export default function MapChrome({
  solidConnected,
  solidShare,
  onConnectClick,
  onCreateEventClick,
  filters,
  onFiltersChange,
}: Props) {
  const retentionLabel =
    retentionOptions.find((o) => o.id === solidShare?.retention)?.label ??
    'Until revoked';

  const sharedCategories = solidShare?.categories ?? [];

  function toggleCategory(category: ListingCategory) {
    const has = filters.categories.includes(category);
    onFiltersChange({
      ...filters,
      categories: has
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category],
    });
  }

  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-2.5">
            <GlassPanel className="flex pointer-events-auto cursor-default max-w-[370px] items-center gap-3 rounded-2xl px-3 py-2.5 sm:px-4">
              <Image
                src="/ncc-logo.png"
                alt="Newcastle City Council"
                width={517}
                height={131}
                className="h-8 w-auto sm:h-9"
                priority
              />
              <div className="h-8 w-px bg-ncc-ink/10" aria-hidden />
              <div className="min-w-0">
                <p className="text-base font-extrabold leading-none tracking-tight text-ncc-ink sm:text-xl">
                  Our Toon
                </p>
                <p className="mt-0.5 truncate text-[11px] font-medium text-ncc-muted">
                  Activities across Newcastle
                </p>
              </div>
            </GlassPanel>

            <ActivityFilters
              filters={filters}
              onChange={onFiltersChange}
              solidConnected={solidConnected}
            />
          </div>

          {solidConnected ? (
            <div className="pointer-events-auto flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={onCreateEventClick}
                className="flex h-[42px] cursor-pointer items-center gap-2 rounded-xl border border-ncc-ink/10 bg-white/50 px-3.5 text-sm font-bold text-ncc-ink/70 shadow-sm backdrop-blur-lg transition hover:bg-white/80"
              >
                <FontAwesomeIcon
                  icon={faCalendarPlus}
                  className="size-3.5 text-ncc-ink/70"
                />
                Create Event
              </button>
              <GlassPanel
                as="button"
                type="button"
                onClick={onConnectClick}
                className="flex h-[42px] shrink-0 cursor-pointer items-center gap-2 rounded-xl px-2.5 text-left transition hover:bg-white/50"
                aria-label="Manage Solid data sharing"
              >
                <div className="relative shrink-0">
                  <span
                    className="flex size-7 items-center justify-center rounded-full bg-solid-soft text-xs font-bold text-solid"
                    aria-hidden
                  >
                    {mockPodProfile.displayName.slice(0, 1)}
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full border border-white bg-solid shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/solid-emblem.svg"
                      alt=""
                      width={10}
                      height={9}
                      className="h-2 w-auto"
                      aria-hidden
                    />
                  </span>
                </div>

                <span className="truncate text-sm font-bold text-ncc-ink">
                  {mockPodProfile.displayName}
                </span>

                {sharedCategories.length > 0 ? (
                  <span className="flex items-center gap-0.5" aria-hidden>
                    {sharedCategories.map((id) => {
                      const entry = SOLID_CATEGORY_ICONS[id];
                      if (!entry) return null;
                      const Icon = entry.icon;
                      return (
                        <span
                          key={id}
                          title={entry.label}
                          className="flex size-5 items-center justify-center rounded-md bg-solid-soft text-solid"
                        >
                          <Icon className="size-3" aria-hidden />
                        </span>
                      );
                    })}
                  </span>
                ) : null}

                <span
                  className="flex max-w-28 items-center gap-1 truncate text-[10px] font-semibold text-ncc-muted sm:max-w-none"
                  title={`Access: ${retentionLabel}`}
                >
                  <ClockIcon className="size-3 shrink-0" aria-hidden />
                  <span className="truncate">{retentionLabel}</span>
                </span>
              </GlassPanel>
            </div>
          ) : (
            <button
              type="button"
              onClick={onConnectClick}
              className="pointer-events-auto flex h-[42px] shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-solid/20 bg-solid/20 px-3.5 text-sm font-bold text-solid shadow-sm backdrop-blur-lg transition hover:bg-solid/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/solid-emblem.svg"
                alt=""
                width={18}
                height={16}
                className="h-4 w-auto"
                aria-hidden
              />
              Connect Solid
            </button>
          )}
        </div>
      </header>

      <div className="absolute inset-x-0 bottom-3 z-20 hidden justify-center sm:bottom-4 md:flex">
        <GlassPanel
          className="pointer-events-auto flex items-center gap-1 rounded-full px-2 py-1.5"
          aria-label="Filter by activity type"
        >
          {CATEGORY_LEGEND.map(({ category, label, swatch }) => {
            const active =
              filters.categories.length === 0 ||
              filters.categories.includes(category);
            const selected = filters.categories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                aria-pressed={selected}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 transition ${
                  selected ? 'bg-black/10' : 'hover:bg-black/[0.05]'
                } ${
                  filters.categories.length > 0 && !active ? 'opacity-45' : ''
                }`}
              >
                <span
                  className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/80"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${swatch} 52%, transparent)`,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${swatch} 65%, white)`,
                  }}
                >
                  <FontAwesomeIcon
                    icon={CATEGORY_FA_ICON[category]}
                    style={{ width: 10, height: 10, color: swatch }}
                  />
                </span>
                <span className="text-[11px] font-semibold text-ncc-muted">
                  {label}
                </span>
              </button>
            );
          })}
          {solidConnected ? (
            <div className="flex items-center gap-1.5 border-l border-ncc-ink/10 py-1 pl-3 pr-2">
              <span
                className="size-3.5 shrink-0 rounded-full bg-transparent shadow-[0_0_0_2px_var(--solid),0_2px_6px_rgba(124,77,255,0.35)]"
                aria-hidden
              />
              <span className="text-[11px] font-semibold text-ncc-muted">
                For you
              </span>
            </div>
          ) : null}
        </GlassPanel>
      </div>
    </>
  );
}
