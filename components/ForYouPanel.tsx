'use client';

import GlassPanel from '@/components/GlassPanel';
import { forYouHighlights } from '@/data/mockOurToon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments,
  faLocationDot,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';

type Props = {
  onSelect: (listingId: string) => void;
};

export default function ForYouPanel({ onSelect }: Props) {
  return (
    <GlassPanel
      as="section"
      className="w-[min(100%,320px)] rounded-2xl p-3.5"
      aria-label="For you recommendations"
    >
      <div className="mb-2.5 flex items-center gap-1.5">
        <FontAwesomeIcon
          icon={faWandMagicSparkles}
          className="size-3 text-solid"
        />
        <h2 className="text-[10px] font-bold uppercase tracking-wide text-ncc-muted">
          For you
        </h2>
        <span className="ml-auto text-[10px] font-semibold text-solid">
          From Solid
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {forYouHighlights.map((item) => (
          <li key={item.listingId}>
            <button
              type="button"
              onClick={() => onSelect(item.listingId)}
              className="flex w-full cursor-pointer items-start gap-2.5 rounded-xl bg-solid/6 px-2.5 py-2 text-left ring-1 ring-solid/15 transition hover:bg-solid/12 hover:ring-solid/25"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/${encodeURIComponent(item.listingId)}/80/80`}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-lg object-cover opacity-55 grayscale"
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold leading-snug text-ncc-ink">
                  {item.title}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[11px] text-ncc-muted">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="size-2.5 opacity-70"
                  />
                  <span className="truncate">
                    {item.venue}
                    <span aria-hidden> · </span>
                    {item.when}
                  </span>
                </span>
                <ul className="mt-1.5 space-y-0.5">
                  {item.reasons
                    .slice(0, item.fromGroupChat ? 3 : 4)
                    .map((reason) => (
                      <li
                        key={reason}
                        className="flex gap-1.5 text-[10px] leading-snug text-ncc-muted"
                      >
                        <span className="mt-1 size-1 shrink-0 rounded-full bg-solid" />
                        <span className="line-clamp-1">{reason}</span>
                      </li>
                    ))}
                </ul>
                {item.fromGroupChat ? (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-solid/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-solid">
                    <FontAwesomeIcon icon={faComments} className="size-2.5" />
                    From group chat
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}
