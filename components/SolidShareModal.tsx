'use client';

import {
  mockPodProfile,
  retentionOptions,
  solidDataCategories,
  type RetentionOption,
} from '@/data/mockOurToon';
import { SOLID_CATEGORY_ICONS } from '@/lib/solidDataIcons';
import { CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useId, useState } from 'react';

export type SolidShareResult = {
  categories: string[];
  retention: RetentionOption;
};

const DEFAULT_CATEGORIES = ['calendar', 'interests', 'location'];

type Props = {
  open: boolean;
  connected?: boolean;
  initialShare?: SolidShareResult | null;
  onClose: () => void;
  onShare: (result: SolidShareResult) => void;
  onDisconnect?: () => void;
};

export default function SolidShareModal({
  open,
  connected = false,
  initialShare = null,
  onClose,
  onShare,
  onDisconnect,
}: Props) {
  const titleId = useId();
  const [selected, setSelected] = useState(
    () => new Set(initialShare?.categories ?? DEFAULT_CATEGORIES),
  );
  const [retention, setRetention] = useState<RetentionOption>(
    () => initialShare?.retention ?? 'revoked',
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const allSelected = selected.size === solidDataCategories.length;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(solidDataCategories.map((c) => c.id)));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer animate-fade-backdrop bg-ncc-ink/35 backdrop-blur-[2px]"
        aria-label="Close sharing dialog"
        onClick={onClose}
      />

      <div className="animate-modal-in relative z-10 flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-solid/20 bg-white shadow-[0_24px_80px_rgba(30,20,60,0.28)]">
        <div className="relative px-5 pt-5 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 cursor-pointer rounded-full p-1.5 text-ncc-muted transition hover:bg-black/5 hover:text-ncc-ink sm:right-5"
            aria-label="Close"
          >
            <XMarkIcon className="size-5" />
          </button>

          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/solid-emblem.svg"
                  alt=""
                  width={28}
                  height={26}
                  className="h-7 w-auto"
                  aria-hidden
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-white bg-solid-soft text-[11px] font-bold text-solid">
                {mockPodProfile.displayName.slice(0, 1)}
              </span>
            </div>
            <p className="text-sm font-medium text-solid">
              {connected
                ? 'Adjust what Our Toon can use to personalise,'
                : 'To personalise activity recommendations,'}
            </p>
            <h2
              id={titleId}
              className="mt-1 text-base font-bold leading-snug text-ncc-ink sm:text-lg"
            >
              {connected
                ? 'Manage data shared from your Solid pod.'
                : 'Our Toon requests access to the following data from your Solid pod.'}
            </h2>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-end gap-2 px-5 sm:px-6">
          <button
            type="button"
            className="cursor-pointer text-xs font-semibold text-solid underline-offset-2 hover:underline"
          >
            Change account
          </button>
          <span className="flex size-8 items-center justify-center rounded-full bg-solid-soft text-xs font-bold text-solid">
            {mockPodProfile.displayName.slice(0, 1)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between px-5 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ncc-muted">
            Data categories
          </p>
          <button
            type="button"
            onClick={toggleAll}
            className="cursor-pointer text-xs font-semibold text-solid hover:underline"
          >
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
        </div>

        <div className="mt-2 min-h-0 flex-1 overflow-y-auto px-5 pb-2 sm:px-6">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {solidDataCategories.map((cat) => {
              const on = selected.has(cat.id);
              const entry = SOLID_CATEGORY_ICONS[cat.id];
              const Icon = entry?.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggle(cat.id)}
                  className={`flex cursor-pointer items-center justify-between gap-2 rounded-2xl px-2.5 py-3 text-left transition ${
                    on
                      ? 'bg-solid-soft ring-1 ring-solid/25'
                      : 'bg-zinc-100/90 hover:bg-zinc-100'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {Icon ? (
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${
                          on ? 'bg-solid text-white' : 'bg-white text-solid'
                        }`}
                        aria-hidden
                      >
                        <Icon className="size-3.5" />
                      </span>
                    ) : null}
                    <span className="min-w-0 flex-1 overflow-hidden">
                      <span className="block truncate text-[13px] font-bold text-ncc-ink">
                        {cat.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] leading-tight text-ncc-muted">
                        {cat.description}
                      </span>
                    </span>
                  </span>
                  <span
                    className={`flex size-4.5 shrink-0 items-center justify-center rounded-full border-2 ${
                      on
                        ? 'border-solid bg-solid text-white'
                        : 'border-zinc-300 bg-white'
                    }`}
                    aria-hidden
                  >
                    {on ? (
                      <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
                        <path
                          d="M2.5 6.2L4.8 8.5L9.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-zinc-100 px-5 py-4 sm:px-6">
          <div className="mb-2 flex items-center gap-2 text-solid">
            <CalendarDaysIcon className="size-4" />
            <p className="text-xs font-semibold">Access duration</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {retentionOptions.map((opt) => {
              const active = retention === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRetention(opt.id)}
                  className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-solid text-white'
                      : 'bg-zinc-100 text-ncc-muted hover:bg-zinc-200/80'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex gap-2">
            {connected && onDisconnect ? (
              <button
                type="button"
                onClick={onDisconnect}
                className="flex-1 cursor-pointer rounded-full bg-zinc-100 py-3 text-sm font-bold text-ncc-ink transition hover:bg-zinc-200/80"
              >
                Disconnect
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 cursor-pointer rounded-full bg-solid-soft py-3 text-sm font-bold text-solid transition hover:bg-solid/15"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                onShare({
                  categories: [...selected],
                  retention,
                })
              }
              disabled={selected.size === 0}
              className="flex-1 cursor-pointer rounded-full bg-solid py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {connected ? 'Update access' : 'Share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
