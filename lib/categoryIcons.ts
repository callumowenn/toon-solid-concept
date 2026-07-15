import {
  faBookOpen,
  faCalendarDays,
  faDumbbell,
  faHandHoldingHeart,
  faLandmark,
  faMusic,
  faPalette,
  faPeopleGroup,
  faScissors,
  faStore,
  faTree,
  faUsers,
  faUtensils,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import type { InterestFilter, ListingCategory } from "@/data/mockOurToon";

export const CATEGORY_FA_ICON: Record<ListingCategory, IconDefinition> = {
  event: faCalendarDays,
  volunteering: faHandHoldingHeart,
  "business-opening": faStore,
  club: faUsers,
};

export const INTEREST_FA_ICON: Record<InterestFilter, IconDefinition> = {
  fitness: faDumbbell,
  arts: faPalette,
  music: faMusic,
  food: faUtensils,
  craft: faScissors,
  books: faBookOpen,
  culture: faLandmark,
  outdoors: faTree,
  community: faPeopleGroup,
};
