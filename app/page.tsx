'use client';

import CalendarWidget from '@/components/CalendarWidget';
import ForYouPanel from '@/components/ForYouPanel';
import GlassPanel from '@/components/GlassPanel';
import MapChrome from '@/components/MapChrome';
import PersonalisationWidget from '@/components/PersonalisationWidget';
import SolidShareModal from '@/components/SolidShareModal';
import type { SolidShareResult } from '@/components/SolidShareModal';
import {
  applyActivityFilters,
  defaultActivityFilters,
  defaultPersonalisation,
  selectMapListings,
  type ListingCategory,
} from '@/data/mockOurToon';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

const MapPanel = dynamic(() => import('@/components/MapPanel'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#dfe3e8] text-sm font-semibold text-ncc-muted">
      Loading Newcastle map…
    </div>
  ),
});

const EXPLORE_KEYWORDS: { label: string; category: ListingCategory }[] = [
  { label: 'clubs', category: 'club' },
  { label: 'events', category: 'event' },
  { label: 'volunteering', category: 'volunteering' },
];

export default function Home() {
  const [solidConnected, setSolidConnected] = useState(false);
  const [solidShare, setSolidShare] = useState<SolidShareResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [personalisation, setPersonalisation] = useState(
    defaultPersonalisation,
  );
  const [filters, setFilters] = useState(defaultActivityFilters);
  const [focusListingId, setFocusListingId] = useState<string | null>(null);
  const [activeRouteListingId, setActiveRouteListingId] = useState<
    string | null
  >(null);

  function openShareModal() {
    setModalKey((k) => k + 1);
    setModalOpen(true);
  }

  function toggleCategory(category: ListingCategory) {
    setFilters((f) => {
      const has = f.categories.includes(category);
      return {
        ...f,
        categories: has
          ? f.categories.filter((c) => c !== category)
          : [...f.categories, category],
      };
    });
  }

  const baseListings = useMemo(
    () => selectMapListings(personalisation, solidConnected),
    [personalisation, solidConnected],
  );

  const listings = useMemo(
    () => applyActivityFilters(baseListings, filters),
    [baseListings, filters],
  );

  const calendarListings = useMemo(
    () =>
      applyActivityFilters(baseListings, {
        ...filters,
        selectedDates: [],
      }),
    [baseListings, filters],
  );

  return (
    <div className="relative h-dvh w-full">
      <div className="absolute inset-0 z-0">
        <MapPanel
          listings={listings}
          solidConnected={solidConnected}
          focusListingId={focusListingId}
          onFocusHandled={() => setFocusListingId(null)}
          activeRouteListingId={activeRouteListingId}
          onConfirmRoute={(id) => setActiveRouteListingId(id)}
        />
      </div>

      <div className="map-vignette" aria-hidden>
        <div className="map-vignette-blur" />
        <div className="map-vignette-wash" />
      </div>

      <div
        id="map-float-layer"
        className="pointer-events-none absolute inset-0 z-[15]"
        aria-hidden
      />

      <MapChrome
        solidConnected={solidConnected}
        solidShare={solidShare}
        onConnectClick={openShareModal}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex max-w-[min(100%-1.5rem,340px)] flex-col gap-2.5 sm:bottom-4 sm:left-4">
        {solidConnected ? (
          <div className="pointer-events-auto flex flex-col gap-2.5">
            <ForYouPanel
              onSelect={(id) => {
                setPersonalisation(100);
                setFocusListingId(id);
              }}
            />
            <PersonalisationWidget
              value={personalisation}
              onChange={setPersonalisation}
            />
          </div>
        ) : (
          <GlassPanel className="pointer-events-auto w-[360px] rounded-2xl px-4 py-3 text-xs leading-relaxed text-ncc-muted">
            Explore{' '}
            {EXPLORE_KEYWORDS.map((item, i) => (
              <span key={item.category}>
                <button
                  type="button"
                  onClick={() => toggleCategory(item.category)}
                  className={`cursor-pointer font-semibold text-ncc-ink underline-offset-2 transition hover:underline ${
                    filters.categories.includes(item.category)
                      ? 'text-ncc-ink underline'
                      : ''
                  }`}
                >
                  {item.label}
                </button>
                {i < EXPLORE_KEYWORDS.length - 2
                  ? ', '
                  : i === EXPLORE_KEYWORDS.length - 2
                    ? ', and '
                    : ''}
              </span>
            ))}{' '}
            across Newcastle. Connect your{' '}
            <a
              href="https://solidproject.org"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer font-semibold text-solid underline-offset-2 hover:underline"
            >
              Solid
            </a>{' '}
            pod to unlock recommendations fitted to your week and interests.
          </GlassPanel>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-3 right-3 z-20 sm:bottom-4 sm:right-4">
        <div className="pointer-events-auto">
          <CalendarWidget
            selectedDates={filters.selectedDates}
            onChange={(selectedDates) =>
              setFilters((f) => ({ ...f, selectedDates }))
            }
            listings={calendarListings}
          />
        </div>
      </div>

      <SolidShareModal
        key={modalKey}
        open={modalOpen}
        connected={solidConnected}
        initialShare={solidShare}
        onClose={() => setModalOpen(false)}
        onDisconnect={() => {
          setModalOpen(false);
          setSolidConnected(false);
          setSolidShare(null);
          setPersonalisation(defaultPersonalisation);
          setFilters((f) => ({
            ...f,
            idVerifiedOnly: false,
            categories: [],
          }));
          setActiveRouteListingId(null);
          setFocusListingId(null);
        }}
        onShare={(result) => {
          setModalOpen(false);
          setSolidShare(result);
          setSolidConnected(true);
          setPersonalisation(55);
        }}
      />
    </div>
  );
}
