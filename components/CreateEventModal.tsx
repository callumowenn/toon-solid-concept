'use client';

import {
  HOME_PIN,
  INTEREST_FILTERS,
  mockPodProfile,
  type CityListing,
  type InterestFilter,
  type ListingCategory,
} from '@/data/mockOurToon';
import { CATEGORY_FA_ICON, INTEREST_FA_ICON } from '@/lib/categoryIcons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarPlus,
  faEnvelopeOpenText,
  faIdCard,
  faLock,
  faUserCheck,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useId, useMemo, useState } from 'react';

export type AttendeeMode = 'open' | 'suggested' | 'required';

export type CreateEventDraft = {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  category: ListingCategory;
  idVerified: boolean;
  idVerifiedMode: AttendeeMode;
  ageMin: number;
  ageMax: number;
  ageMode: AttendeeMode;
  interests: InterestFilter[];
  interestMode: AttendeeMode;
  provideContact: boolean;
  inviteOnly: boolean;
  requireConfirmation: boolean;
};

export type CreateEventResult = {
  listing: CityListing;
  draft: CreateEventDraft;
  estimatedAttendees: number;
  invited: boolean;
};

const DEFAULT_DRAFT: CreateEventDraft = {
  title: '',
  description: '',
  date: 'Wed 15 Jul',
  time: '18:00–20:00',
  venue: 'Urban Sciences Building, NE4 5TG',
  capacity: 24,
  category: 'event',
  idVerified: false,
  idVerifiedMode: 'suggested',
  ageMin: 18,
  ageMax: 65,
  ageMode: 'open',
  interests: [],
  interestMode: 'suggested',
  provideContact: true,
  inviteOnly: false,
  requireConfirmation: false,
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (result: CreateEventResult) => void;
};

function estimateSuitableAttendees(draft: CreateEventDraft): number {
  let pool = 220;

  if (draft.idVerified) {
    pool *= draft.idVerifiedMode === 'required' ? 0.32 : 0.62;
  }

  if (draft.ageMode !== 'open') {
    const span = Math.max(1, draft.ageMax - draft.ageMin);
    const factor = Math.min(1, span / 50);
    pool *=
      draft.ageMode === 'required'
        ? 0.35 + factor * 0.45
        : 0.55 + factor * 0.35;
  }

  if (draft.interests.length > 0) {
    const interestFactor = Math.max(0.18, 1 - draft.interests.length * 0.14);
    pool *=
      draft.interestMode === 'required'
        ? interestFactor * 0.75
        : Math.min(0.95, interestFactor + 0.2);
  }

  if (draft.inviteOnly) pool *= 0.55;
  if (draft.requireConfirmation) pool *= 0.85;

  return Math.max(3, Math.round(pool));
}

function ModeToggle({
  value,
  onChange,
  disabled,
}: {
  value: AttendeeMode;
  onChange: (v: AttendeeMode) => void;
  disabled?: boolean;
}) {
  const options: { id: AttendeeMode; label: string }[] = [
    { id: 'open', label: 'Open' },
    { id: 'suggested', label: 'Suggested' },
    { id: 'required', label: 'Required' },
  ];

  return (
    <div
      className={`inline-flex rounded-full bg-zinc-100 p-0.5 ${disabled ? 'opacity-40' : ''}`}
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.id)}
          className={`cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-bold transition disabled:cursor-not-allowed ${
            value === opt.id
              ? 'bg-ncc-ink text-white'
              : 'text-ncc-muted hover:text-ncc-ink'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function CreateEventModal({ open, onClose, onCreate }: Props) {
  const titleId = useId();
  const [draft, setDraft] = useState<CreateEventDraft>(DEFAULT_DRAFT);
  const [invited, setInvited] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDraft(DEFAULT_DRAFT);
    setInvited(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const estimated = useMemo(() => estimateSuitableAttendees(draft), [draft]);

  if (!open) return null;

  const canSubmit =
    draft.title.trim().length > 0 && draft.venue.trim().length > 0;

  function toggleInterest(id: InterestFilter) {
    setDraft((d) => ({
      ...d,
      interests: d.interests.includes(id)
        ? d.interests.filter((i) => i !== id)
        : [...d.interests, id],
    }));
  }

  function handleCreate() {
    if (!canSubmit) return;
    const id = `user-event-${Date.now()}`;
    const listing: CityListing = {
      id,
      title: draft.title.trim(),
      category: draft.category,
      lat: HOME_PIN.lat + 0.004,
      lng: HOME_PIN.lng + 0.008,
      date: draft.date,
      time: draft.time,
      venue: draft.venue.trim(),
      organiser: draft.provideContact
        ? mockPodProfile.displayName
        : 'Community organiser',
      placesFilled: 0,
      placesTotal: draft.capacity,
      idVerified: draft.idVerified && draft.idVerifiedMode === 'required',
      personalisationTags: [
        ...draft.interests,
        ...(draft.description ? ['community'] : []),
      ],
      personalMatch: 0.92,
    };

    onCreate({
      listing,
      draft,
      estimatedAttendees: estimated,
      invited,
    });
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
        aria-label="Close create event dialog"
        onClick={onClose}
      />

      <div className="animate-modal-in relative z-10 flex max-h-[min(94dvh,780px)] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-ncc-ink/10 bg-white shadow-[0_24px_80px_rgba(30,20,60,0.28)]">
        <div className="relative border-b border-zinc-100 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 cursor-pointer rounded-full p-1.5 text-ncc-muted transition hover:bg-black/5 hover:text-ncc-ink"
            aria-label="Close"
          >
            <XMarkIcon className="size-5" />
          </button>
          <div className="flex items-center gap-3 pr-10">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#4a7c8c]/15 text-[#4a7c8c]">
              <FontAwesomeIcon icon={faCalendarPlus} className="size-5" />
            </span>
            <div>
              <h2
                id={titleId}
                className="text-base font-bold text-ncc-ink sm:text-lg"
              >
                Create a public event
              </h2>
              <p className="text-xs text-ncc-muted">
                Posted from your Solid pod · visible on Our Toon
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-zinc-100/90 px-3.5 py-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#4a7c8c]/20 text-[#4a7c8c]">
              <FontAwesomeIcon
                icon={CATEGORY_FA_ICON[draft.category]}
                className="size-5"
              />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ncc-muted">
                Event image
              </p>
              <p className="text-xs text-ncc-muted">
                Uses the same category icon as other map events
              </p>
            </div>
          </div>

          <label className="mb-3 block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ncc-muted">
              Title
            </span>
            <input
              type="text"
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
              placeholder="e.g. Community board games night"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-ncc-ink outline-none transition placeholder:font-medium placeholder:text-ncc-muted/60 focus:border-solid/40 focus:ring-2 focus:ring-solid/20"
            />
          </label>

          <label className="mb-3 block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ncc-muted">
              Description
            </span>
            <textarea
              value={draft.description}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
              rows={3}
              placeholder="What should people know before they come?"
              className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-ncc-ink outline-none transition placeholder:text-ncc-muted/60 focus:border-solid/40 focus:ring-2 focus:ring-solid/20"
            />
          </label>

          <div className="mb-3 grid grid-cols-2 gap-2.5">
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ncc-muted">
                Date
              </span>
              <input
                type="text"
                value={draft.date}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, date: e.target.value }))
                }
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-ncc-ink outline-none focus:border-solid/40 focus:ring-2 focus:ring-solid/20"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ncc-muted">
                Time
              </span>
              <input
                type="text"
                value={draft.time}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, time: e.target.value }))
                }
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-ncc-ink outline-none focus:border-solid/40 focus:ring-2 focus:ring-solid/20"
              />
            </label>
          </div>

          <div className="mb-3 grid grid-cols-[1fr_auto] gap-2.5">
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ncc-muted">
                Location
              </span>
              <input
                type="text"
                value={draft.venue}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, venue: e.target.value }))
                }
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-ncc-ink outline-none focus:border-solid/40 focus:ring-2 focus:ring-solid/20"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-ncc-muted">
                Capacity
              </span>
              <input
                type="number"
                min={2}
                max={500}
                value={draft.capacity}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    capacity: Math.max(2, Number(e.target.value) || 2),
                  }))
                }
                className="w-20 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-ncc-ink outline-none focus:border-solid/40 focus:ring-2 focus:ring-solid/20"
              />
            </label>
          </div>

          <div className="mb-4 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3.5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-ncc-muted">
                Suitable attendees
              </p>
              <p className="text-[10px] font-medium text-ncc-muted">
                Open · suggested · required
              </p>
            </div>

            <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-zinc-100">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ncc-ink">
                <input
                  type="checkbox"
                  checked={draft.idVerified}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      idVerified: e.target.checked,
                      idVerifiedMode: e.target.checked
                        ? d.idVerifiedMode === 'open'
                          ? 'suggested'
                          : d.idVerifiedMode
                        : 'open',
                    }))
                  }
                  className="size-4 cursor-pointer rounded border-zinc-300 text-solid accent-solid"
                />
                <FontAwesomeIcon
                  icon={faIdCard}
                  className="size-3.5 text-ncc-muted"
                />
                ID-verified only
              </label>
              <ModeToggle
                value={draft.idVerified ? draft.idVerifiedMode : 'open'}
                disabled={!draft.idVerified}
                onChange={(idVerifiedMode) =>
                  setDraft((d) => ({ ...d, idVerifiedMode }))
                }
              />
            </div>

            <div className="mb-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-zinc-100">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ncc-ink">Age range</p>
                <ModeToggle
                  value={draft.ageMode}
                  onChange={(ageMode) => setDraft((d) => ({ ...d, ageMode }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={draft.ageMax}
                  value={draft.ageMin}
                  disabled={draft.ageMode === 'open'}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      ageMin: Math.min(d.ageMax, Number(e.target.value) || 0),
                    }))
                  }
                  className="w-16 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm font-semibold disabled:opacity-40"
                />
                <span className="text-xs text-ncc-muted">to</span>
                <input
                  type="number"
                  min={draft.ageMin}
                  max={99}
                  value={draft.ageMax}
                  disabled={draft.ageMode === 'open'}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      ageMax: Math.max(
                        d.ageMin,
                        Number(e.target.value) || d.ageMin,
                      ),
                    }))
                  }
                  className="w-16 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm font-semibold disabled:opacity-40"
                />
              </div>
            </div>

            <div className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-zinc-100">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ncc-ink">
                  Suggested interests
                </p>
                <ModeToggle
                  value={draft.interestMode}
                  onChange={(interestMode) =>
                    setDraft((d) => ({ ...d, interestMode }))
                  }
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {INTEREST_FILTERS.map((interest) => {
                  const active = draft.interests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                        active
                          ? 'bg-black/65 text-white'
                          : 'bg-zinc-100 text-ncc-ink hover:bg-zinc-200/80'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={INTEREST_FA_ICON[interest.id]}
                        className="size-2.5 opacity-90"
                      />
                      {interest.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mb-4 space-y-2">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-zinc-50 px-3 py-2.5 text-sm font-semibold text-ncc-ink ring-1 ring-zinc-100">
              <input
                type="checkbox"
                checked={draft.provideContact}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, provideContact: e.target.checked }))
                }
                className="size-4 cursor-pointer accent-solid"
              />
              <FontAwesomeIcon
                icon={faEnvelopeOpenText}
                className="size-3.5 text-ncc-muted"
              />
              Provide my contact as organiser
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-zinc-50 px-3 py-2.5 text-sm font-semibold text-ncc-ink ring-1 ring-zinc-100">
              <input
                type="checkbox"
                checked={draft.inviteOnly}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, inviteOnly: e.target.checked }))
                }
                className="size-4 cursor-pointer accent-solid"
              />
              <FontAwesomeIcon
                icon={faLock}
                className="size-3.5 text-ncc-muted"
              />
              Invite only
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-zinc-50 px-3 py-2.5 text-sm font-semibold text-ncc-ink ring-1 ring-zinc-100">
              <input
                type="checkbox"
                checked={draft.requireConfirmation}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    requireConfirmation: e.target.checked,
                  }))
                }
                className="size-4 cursor-pointer accent-solid"
              />
              <FontAwesomeIcon
                icon={faUserCheck}
                className="size-3.5 text-ncc-muted"
              />
              Require confirmation for attendance
            </label>
          </div>

          <div className="rounded-2xl bg-solid/8 px-4 py-3.5 ring-1 ring-solid/15">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-solid">
                  <FontAwesomeIcon icon={faUsers} className="size-3" />
                  Estimated suitable nearby
                </p>
                <p className="mt-1 text-2xl font-extrabold tabular-nums text-ncc-ink">
                  {estimated}
                  <span className="ml-1.5 text-sm font-semibold text-ncc-muted">
                    people
                  </span>
                </p>
                <p className="mt-0.5 text-[11px] text-ncc-muted">
                  Simulated from Solid pod criteria in the Newcastle area
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInvited(true)}
                disabled={estimated < 1}
                className={`shrink-0 cursor-pointer rounded-full px-3.5 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  invited
                    ? 'bg-solid text-white'
                    : 'bg-white text-solid ring-1 ring-solid/25 hover:bg-solid/10'
                }`}
              >
                {invited ? 'Invites queued' : 'Invite them'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-zinc-100 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-full bg-zinc-100 py-3 text-sm font-bold text-ncc-ink transition hover:bg-zinc-200/80"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!canSubmit}
            className="flex-1 cursor-pointer rounded-full bg-ncc-ink py-3 text-sm font-bold text-white transition hover:bg-ncc-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Publish event
          </button>
        </div>
      </div>
    </div>
  );
}
