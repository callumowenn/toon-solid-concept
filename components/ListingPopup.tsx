'use client';

import {
  CATEGORY_LEGEND,
  listingDetails,
  type CityListing,
} from '@/data/mockOurToon';
import { CATEGORY_FA_ICON } from '@/lib/categoryIcons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBeerMugEmpty,
  faBookmark,
  faCalendarDays,
  faClock,
  faComments,
  faEnvelope,
  faIdCard,
  faLocationDot,
  faRoute,
  faUserCheck,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

type Props = {
  listing: CityListing;
  highlight: boolean;
  routeActive?: boolean;
  onConfirmRoute?: (listingId: string) => void;
};

export default function ListingPopup({
  listing,
  highlight,
  routeActive = false,
  onConfirmRoute,
}: Props) {
  const details = listingDetails(listing);
  const placesLeft = Math.max(0, details.placesTotal - details.placesFilled);
  const fillPct = Math.round(
    (details.placesFilled / details.placesTotal) * 100,
  );
  const fromChat = Boolean(listing.fromGroupChat);
  const categoryIcon = fromChat
    ? faBeerMugEmpty
    : CATEGORY_FA_ICON[listing.category];
  const categoryColor =
    CATEGORY_LEGEND.find((c) => c.category === listing.category)?.swatch ??
    '#5c6570';

  return (
    <div className="listing-popup w-[248px]">
      <div className="relative -mx-1 -mt-1 mb-2.5 overflow-hidden rounded-lg">
        <div
          className="flex h-[92px] w-full items-center justify-center bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200"
          aria-hidden
        >
          <span
            className="flex size-12 items-center justify-center rounded-full opacity-70"
            style={{
              backgroundColor: `color-mix(in srgb, ${fromChat ? '#7c4dff' : categoryColor} 22%, white)`,
              color: fromChat ? '#7c4dff' : categoryColor,
            }}
          >
            <FontAwesomeIcon icon={categoryIcon} className="size-5" />
          </span>
        </div>
        {fromChat ? (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-solid px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
            <FontAwesomeIcon icon={faComments} className="size-2.5" />
            Group chat
          </span>
        ) : highlight ? (
          <span className="absolute left-2 top-2 rounded-md bg-solid px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
            For you
          </span>
        ) : null}
        {details.idVerified ? (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-ncc-ink/85 px-1.5 py-0.5 text-[9px] font-bold text-white">
            <FontAwesomeIcon icon={faIdCard} className="size-2.5" />
            ID verified
          </span>
        ) : null}
      </div>

      <p className="text-[13px] font-extrabold leading-snug text-ncc-ink">
        {listing.title}
      </p>

      {fromChat ? (
        <p className="mt-1.5 text-[11px] leading-snug text-ncc-muted">
          Solid inferred this plan from a private group chat — friends are heading
          to the pub at {details.time.split('–')[0] || '19:00'}.
        </p>
      ) : null}

      <dl className="mt-2 space-y-1.5 text-[11px] text-ncc-muted">
        <div className="flex items-start gap-2">
          <FontAwesomeIcon
            icon={faLocationDot}
            className="mt-0.5 size-3 shrink-0 text-ncc-ink/45"
          />
          <div>
            <dt className="sr-only">Location</dt>
            <dd className="font-semibold text-ncc-ink">
              {listing.venue ?? 'Newcastle'}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="mt-0.5 size-3 shrink-0 text-ncc-ink/45"
          />
          <div>
            <dt className="sr-only">Date</dt>
            <dd className="font-semibold text-ncc-ink">
              {listing.date ?? 'Date TBC'}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <FontAwesomeIcon
            icon={faClock}
            className="mt-0.5 size-3 shrink-0 text-ncc-ink/45"
          />
          <div>
            <dt className="sr-only">Time</dt>
            <dd className="font-semibold text-ncc-ink">{details.time}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <FontAwesomeIcon
            icon={faUsers}
            className="mt-0.5 size-3 shrink-0 text-ncc-ink/45"
          />
          <div className="min-w-0 flex-1">
            <dt className="sr-only">Places</dt>
            <dd>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-ncc-ink">
                  {fromChat
                    ? `${details.placesFilled} friends going`
                    : `${details.placesFilled}/${details.placesTotal} places`}
                </span>
                {!fromChat ? (
                  <span className="text-[10px]">{placesLeft} left</span>
                ) : (
                  <span className="text-[10px]">inc. you?</span>
                )}
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-black/8">
                <div
                  className="h-full rounded-full bg-ncc-ink/70"
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            </dd>
          </div>
        </div>
      </dl>

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {fromChat && onConfirmRoute ? (
          <button
            type="button"
            onClick={() => onConfirmRoute(listing.id)}
            className="col-span-2 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-solid px-2.5 py-2 text-[11px] font-bold text-white transition hover:brightness-110"
          >
            <FontAwesomeIcon icon={faRoute} className="size-3" />
            {routeActive ? 'Cycle route shown' : 'Confirm · cycle route'}
          </button>
        ) : (
          <button
            type="button"
            className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-ncc-ink px-2.5 py-2 text-[11px] font-bold text-white transition hover:bg-ncc-ink/90"
          >
            <FontAwesomeIcon icon={faUserCheck} className="size-3" />
            Sign up
          </button>
        )}
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-black/[0.06] px-2 py-1.5 text-[11px] font-bold text-ncc-ink transition hover:bg-black/[0.1]"
        >
          <FontAwesomeIcon icon={faEnvelope} className="size-3 opacity-70" />
          Contact
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-black/[0.06] px-2 py-1.5 text-[11px] font-bold text-ncc-ink transition hover:bg-black/[0.1]"
        >
          <FontAwesomeIcon icon={faBookmark} className="size-3 opacity-70" />
          Save
        </button>
      </div>

      <p className="mt-2 truncate text-[10px] text-ncc-muted">
        {fromChat
          ? 'Inferred by Solid from shared pod chat access'
          : `Organised by ${details.organiser}`}
      </p>
    </div>
  );
}
