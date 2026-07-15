'use client';

import GlassPanel from '@/components/GlassPanel';
import {
  INTEREST_FILTERS,
  type ActivityFilterState,
  type InterestFilter,
} from '@/data/mockOurToon';
import { INTEREST_FA_ICON } from '@/lib/categoryIcons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';

type Props = {
  filters: ActivityFilterState;
  onChange: (next: ActivityFilterState) => void;
  solidConnected: boolean;
};

export default function ActivityFilters({
  filters,
  onChange,
  solidConnected,
}: Props) {
  function toggleInterest(id: InterestFilter) {
    const has = filters.interests.includes(id);
    onChange({
      ...filters,
      interests: has
        ? filters.interests.filter((i) => i !== id)
        : [...filters.interests, id],
    });
  }

  return (
    <GlassPanel
      as="section"
      className="w-[370px] rounded-2xl p-3 pointer-events-auto"
      aria-label="Filter activities"
    >
      <div className="-mx-3 flex gap-1.5 overflow-x-auto pl-3 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {INTEREST_FILTERS.map((interest) => {
          const active = filters.interests.includes(interest.id);
          return (
            <button
              key={interest.id}
              type="button"
              onClick={() => toggleInterest(interest.id)}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? 'bg-black/65 text-white'
                  : 'bg-black/5 text-ncc-ink hover:bg-black/8'
              }`}
            >
              <FontAwesomeIcon
                icon={INTEREST_FA_ICON[interest.id]}
                className="size-3 opacity-90"
              />
              {interest.label}
            </button>
          );
        })}
      </div>

      {solidConnected ? (
        <button
          type="button"
          onClick={() =>
            onChange({
              ...filters,
              idVerifiedOnly: !filters.idVerifiedOnly,
            })
          }
          className={`inline-flex mt-2 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            filters.idVerifiedOnly
              ? 'bg-ncc-ink text-white'
              : 'bg-black/[0.05] text-ncc-ink hover:bg-black/[0.08]'
          }`}
        >
          <FontAwesomeIcon icon={faIdCard} className="size-3 opacity-90" />
          ID-verified only
        </button>
      ) : null}
    </GlassPanel>
  );
}
