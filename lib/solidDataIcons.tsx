'use client';

import { faBicycle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  HeartIcon,
  MapPinIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

export type SolidCategoryIcon = ComponentType<SVGProps<SVGSVGElement>>;

function BicycleIcon({ className }: SVGProps<SVGSVGElement>) {
  return <FontAwesomeIcon icon={faBicycle} className={className} aria-hidden />;
}

export const SOLID_CATEGORY_ICONS: Record<
  string,
  { icon: SolidCategoryIcon; label: string }
> = {
  calendar: { icon: CalendarDaysIcon, label: 'Calendar' },
  interests: { icon: HeartIcon, label: 'Interests' },
  location: { icon: MapPinIcon, label: 'Location' },
  mobility: { icon: BicycleIcon, label: 'Mobility' },
  accessibility: { icon: UserGroupIcon, label: 'Accessibility' },
  community: { icon: UsersIcon, label: 'Community' },
  'life-stage': { icon: AcademicCapIcon, label: 'Life stage' },
  preferences: { icon: AdjustmentsHorizontalIcon, label: 'Preferences' },
};
