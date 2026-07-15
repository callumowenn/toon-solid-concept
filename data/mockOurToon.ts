/**
 * Mock Solid pod–shaped data for Our Toon.
 * Stands in for WebID / pod reads — no real OIDC or council feed.
 */

export type ListingCategory =
  | "event"
  | "volunteering"
  | "business-opening"
  | "club";

export type CityListing = {
  id: string;
  title: string;
  category: ListingCategory;
  lat: number;
  lng: number;
  date?: string;
  /** Display time window, e.g. "18:00–20:00" */
  time?: string;
  venue?: string;
  organiser?: string;
  /** Optional cover image URL */
  image?: string;
  placesFilled?: number;
  placesTotal?: number;
  /** Requires Solid ID verification to attend */
  idVerified?: boolean;
  /** Inferred from a Solid-accessible private group chat */
  fromGroupChat?: boolean;
  personalisationTags: string[];
  /** 0 = citywide general, 1 = only shown when heavily personalised */
  personalMatch: number;
};

export type WeekDay = {
  key: string;
  label: string;
  short: string;
  free: boolean;
  note?: string;
};

export type SolidDataCategory = {
  id: string;
  title: string;
  description: string;
};

export type RetentionOption = "once" | "revoked" | "day" | "month" | "year";

/** Interest chips in the activity filter reel (themes only) */
export type InterestFilter =
  | "fitness"
  | "arts"
  | "music"
  | "food"
  | "craft"
  | "books"
  | "culture"
  | "outdoors"
  | "community";

/** Demo “today” — Wed 15 Jul 2026 */
export const DEMO_TODAY = "2026-07-15";

export const INTEREST_FILTERS: { id: InterestFilter; label: string }[] = [
  { id: "fitness", label: "Fitness" },
  { id: "arts", label: "Arts" },
  { id: "music", label: "Music" },
  { id: "food", label: "Food" },
  { id: "craft", label: "Craft" },
  { id: "books", label: "Books" },
  { id: "culture", label: "Culture" },
  { id: "outdoors", label: "Outdoors" },
  { id: "community", label: "Community" },
];

/** Quayside / Tyne Bridge area */
export const NEWCASTLE_CENTER = {
  lat: 54.972,
  lng: -1.613,
} as const;

export const CATEGORY_LEGEND: {
  category: ListingCategory;
  label: string;
  swatch: string;
}[] = [
  { category: "club", label: "Clubs", swatch: "#3d5a80" },
  { category: "event", label: "Events", swatch: "#4a7c8c" },
  { category: "volunteering", label: "Volunteering", swatch: "#2f6f66" },
  { category: "business-opening", label: "Openings", swatch: "#6b7c93" },
];

/** Citywide general set — always visible before Solid */
export const generalListings: CityListing[] = [
  {
    id: "ev-quayside-market",
    title: "Quayside Sunday Market",
    category: "event",
    lat: 54.9692,
    lng: -1.5988,
    date: "19 Jul",
    venue: "Quayside",
    personalisationTags: ["outdoors", "family"],
    personalMatch: 0.1,
  },
  {
    id: "club-world-hq",
    title: "Digital Night at Digital",
    category: "club",
    lat: 54.9718,
    lng: -1.6125,
    date: "18 Jul",
    venue: "Digital",
    personalisationTags: ["nightlife", "music"],
    personalMatch: 0.35,
  },
  {
    id: "vol-ooda",
    title: "Litter pick — Town Moor",
    category: "volunteering",
    lat: 54.9835,
    lng: -1.622,
    date: "20 Jul",
    time: "18:00–20:00",
    venue: "Town Moor",
    organiser: "OODA Newcastle",
    placesFilled: 14,
    placesTotal: 24,
    idVerified: true,
    personalisationTags: ["outdoors", "community", "sustainability"],
    personalMatch: 0.2,
  },
  {
    id: "biz-grainger",
    title: "New bookshop — Grainger Market",
    category: "business-opening",
    lat: 54.9736,
    lng: -1.6128,
    date: "22 Jul",
    venue: "Grainger Market",
    personalisationTags: ["indep-retail", "culture"],
    personalMatch: 0.2,
  },
  {
    id: "ev-theatre-royal",
    title: "Fringe preview — Theatre Royal",
    category: "event",
    lat: 54.9729,
    lng: -1.6112,
    date: "24 Jul",
    venue: "Theatre Royal",
    personalisationTags: ["arts", "culture"],
    personalMatch: 0.4,
  },
  {
    id: "club-cobalt-night",
    title: "DIY disco — Ouseburn",
    category: "club",
    lat: 54.9748,
    lng: -1.5895,
    date: "25 Jul",
    venue: "Ouseburn",
    personalisationTags: ["nightlife", "diy", "music"],
    personalMatch: 0.55,
  },
  {
    id: "vol-foodbank",
    title: "Food bank sorting shift",
    category: "volunteering",
    lat: 54.9782,
    lng: -1.6185,
    date: "21 Jul",
    venue: "West End",
    personalisationTags: ["community", "mutual-aid"],
    personalMatch: 0.25,
  },
  {
    id: "ev-bridges-run",
    title: "Bridges 5k social run",
    category: "event",
    lat: 54.9675,
    lng: -1.6065,
    date: "19 Jul",
    venue: "Quayside",
    personalisationTags: ["outdoors", "fitness"],
    personalMatch: 0.3,
  },
  {
    id: "biz-cafe-jesmond",
    title: "Popup café — Jesmond Dene",
    category: "business-opening",
    lat: 54.988,
    lng: -1.599,
    date: "23 Jul",
    venue: "Jesmond",
    personalisationTags: ["food", "outdoors"],
    personalMatch: 0.2,
  },
  {
    id: "club-nue-skool",
    title: "Vinyl social — Quayside warehouse",
    category: "club",
    lat: 54.9668,
    lng: -1.592,
    date: "26 Jul",
    venue: "Quayside",
    personalisationTags: ["music", "nightlife"],
    personalMatch: 0.5,
  },
  {
    id: "ev-chinoiserie",
    title: "Lunchtime concert — Civic Centre",
    category: "event",
    lat: 54.9778,
    lng: -1.6118,
    date: "15 Jul",
    venue: "Civic Centre",
    personalisationTags: ["arts", "lunch"],
    personalMatch: 0.15,
  },
  {
    id: "vol-heaton",
    title: "Community garden open day",
    category: "volunteering",
    lat: 54.9855,
    lng: -1.581,
    date: "15 Jul",
    venue: "Heaton",
    personalisationTags: ["outdoors", "community"],
    personalMatch: 0.2,
  },
  {
    id: "club-chess",
    title: "Pub chess club — Byker",
    category: "club",
    lat: 54.9712,
    lng: -1.58,
    date: "Wednesdays",
    venue: "Byker",
    personalisationTags: ["social", "indoor"],
    personalMatch: 0.25,
  },
  {
    id: "ev-swim",
    title: "Lido lane swim social",
    category: "event",
    lat: 54.979,
    lng: -1.6055,
    date: "15 Jul",
    venue: "City Pool",
    personalisationTags: ["fitness", "outdoors"],
    personalMatch: 0.3,
  },
  {
    id: "biz-street-food",
    title: "Street food night — Grey's",
    category: "business-opening",
    lat: 54.973,
    lng: -1.6135,
    date: "16 Jul",
    venue: "Grey Street",
    personalisationTags: ["food", "nightlife"],
    personalMatch: 0.25,
  },
  {
    id: "ev-baltic",
    title: "Late night at Baltic",
    category: "event",
    lat: 54.969,
    lng: -1.5995,
    date: "25 Jul",
    venue: "Gateshead Quays",
    personalisationTags: ["arts", "culture"],
    personalMatch: 0.35,
  },
  {
    id: "biz-shieldfield",
    title: "Maker space open studio",
    category: "business-opening",
    lat: 54.9755,
    lng: -1.598,
    date: "27 Jul",
    venue: "Shieldfield",
    personalisationTags: ["diy", "craft"],
    personalMatch: 0.4,
  },
];

/**
 * Recommendations unlocked after Solid connect — fitted to mock pod
 * (arts, diy music, free Wed/Fri evenings, local volunteering).
 */
export const personalisedListings: CityListing[] = [
  {
    id: "you-town-moor",
    title: "Town Moor litter pick",
    category: "volunteering",
    lat: 54.9835,
    lng: -1.622,
    date: "15 Jul",
    time: "18:00–20:00",
    venue: "Town Moor",
    organiser: "OODA Newcastle",
    placesFilled: 14,
    placesTotal: 24,
    idVerified: true,
    personalisationTags: ["outdoors", "community", "sustainability"],
    personalMatch: 0.68,
  },
  {
    id: "you-ouseburn-print",
    title: "Print night — fitted to your craft tags",
    category: "club",
    lat: 54.9755,
    lng: -1.587,
    date: "Wed 16 Jul",
    venue: "Ouseburn",
    personalisationTags: ["diy", "arts", "craft"],
    personalMatch: 0.85,
  },
  {
    id: "you-friday-folk",
    title: "Folk session — free Friday evening",
    category: "event",
    lat: 54.9708,
    lng: -1.6155,
    date: "Fri 18 Jul",
    venue: "Bigg Market",
    personalisationTags: ["music", "social"],
    personalMatch: 0.9,
  },
  {
    id: "you-jesmond-yoga",
    title: "Morning movement — near your home pin",
    category: "event",
    lat: 54.9865,
    lng: -1.605,
    date: "Wed 16 Jul",
    venue: "Jesmond",
    personalisationTags: ["fitness", "wellbeing"],
    personalMatch: 0.8,
  },
  {
    id: "you-vol-library",
    title: "Library reading buddy shift",
    category: "volunteering",
    lat: 54.977,
    lng: -1.6145,
    date: "Fri 18 Jul",
    venue: "City Library",
    personalisationTags: ["community", "literacy"],
    personalMatch: 0.75,
  },
  {
    id: "you-curious-festival",
    title: "Curious Arts late — arts preference",
    category: "event",
    lat: 54.9685,
    lng: -1.601,
    date: "Sat 19 Jul",
    venue: "Quayside",
    personalisationTags: ["arts", "culture"],
    personalMatch: 0.7,
  },
  {
    id: "you-bike-co-op",
    title: "Bike co-op repair evening",
    category: "club",
    lat: 54.981,
    lng: -1.595,
    date: "Wed 16 Jul",
    venue: "Heaton",
    personalisationTags: ["diy", "mobility"],
    personalMatch: 0.88,
  },
  {
    id: "you-soup-kitchen",
    title: "Shared supper — mutual aid group",
    category: "volunteering",
    lat: 54.974,
    lng: -1.62,
    date: "Fri 18 Jul",
    venue: "Elswick",
    personalisationTags: ["community", "mutual-aid"],
    personalMatch: 0.72,
  },
  {
    id: "you-record-fair",
    title: "Record fair — music taste match",
    category: "event",
    lat: 54.9725,
    lng: -1.618,
    date: "Sat 19 Jul",
    venue: "Star & Shadow",
    personalisationTags: ["music", "culture"],
    personalMatch: 0.82,
  },
  {
    id: "you-wobbly-duck",
    title: "The Wobbly Duck",
    category: "event",
    lat: 54.9744,
    lng: -1.6143,
    date: "Wed 15 Jul",
    time: "19:00–late",
    venue: "4 Old Eldon Square, NE1 7JG",
    organiser: "Inferred from group chat",
    placesFilled: 4,
    placesTotal: 6,
    fromGroupChat: true,
    personalisationTags: ["nightlife", "social", "music"],
    personalMatch: 0.95,
  },
];

/** Mock home pin — Urban Sciences Building, NE4 5TG */
export const HOME_PIN = {
  label: "Urban Sciences Building",
  postcode: "NE4 5TG",
  lat: 54.97355,
  lng: -1.62524,
} as const;

/** Upcoming week from mock Solid calendar pod */
export const upcomingWeek: WeekDay[] = [
  { key: "mon", label: "Monday", short: "Mon", free: false, note: "Work" },
  { key: "tue", label: "Tuesday", short: "Tue", free: false, note: "Work" },
  {
    key: "wed",
    label: "Wednesday",
    short: "Wed",
    free: true,
    note: "Evening free",
  },
  { key: "thu", label: "Thursday", short: "Thu", free: false, note: "Work" },
  {
    key: "fri",
    label: "Friday",
    short: "Fri",
    free: true,
    note: "Evening free",
  },
  { key: "sat", label: "Saturday", short: "Sat", free: true, note: "Open" },
  { key: "sun", label: "Sunday", short: "Sun", free: true, note: "Open" },
];

export const solidDataCategories: SolidDataCategory[] = [
  {
    id: "calendar",
    title: "Calendar",
    description: "Availability & busy times",
  },
  {
    id: "interests",
    title: "Interests",
    description: "Hobbies, music, arts…",
  },
  {
    id: "location",
    title: "Location",
    description: "Neighbourhood & home pin",
  },
  {
    id: "mobility",
    title: "Mobility",
    description: "Travel modes & radius",
  },
  {
    id: "accessibility",
    title: "Accessibility",
    description: "Access needs & preferences",
  },
  {
    id: "community",
    title: "Community",
    description: "Groups & volunteering",
  },
  {
    id: "life-stage",
    title: "Life stage",
    description: "Family, study, work…",
  },
  {
    id: "preferences",
    title: "Preferences",
    description: "Noise, crowd, indoor/out",
  },
];

export const retentionOptions: {
  id: RetentionOption;
  label: string;
}[] = [
  { id: "once", label: "Allow once" },
  { id: "revoked", label: "Until revoked" },
  { id: "day", label: "1 Day" },
  { id: "month", label: "1 Month" },
  { id: "year", label: "1 Year" },
];

export const mockPodProfile = {
  displayName: "Alex",
  webId: "https://alex.inrupt.net/profile/card#me",
  neighbourhood: "Jesmond",
};

/**
 * Blend citywide + personalised pins from Solid connect + slider (0–100).
 */
export function selectMapListings(
  personalisation: number,
  solidConnected: boolean,
): CityListing[] {
  if (!solidConnected) {
    return generalListings;
  }

  const level = personalisation / 100;
  const fromGeneral = generalListings.filter((l) => l.personalMatch <= 0.55 + level * 0.2);
  const fromPersonal = personalisedListings.filter(
    (l) => l.personalMatch <= level + 0.15 && level > 0.08,
  );

  if (level < 0.12) {
    return generalListings;
  }

  if (level > 0.85) {
    const keepGeneral = generalListings.filter((l) => l.personalMatch >= 0.35);
    return dedupeById([...fromPersonal, ...keepGeneral]);
  }

  return dedupeById([...fromGeneral, ...fromPersonal]);
}

function dedupeById(listings: CityListing[]): CityListing[] {
  const seen = new Set<string>();
  return listings.filter((l) => {
    if (seen.has(l.id)) return false;
    seen.add(l.id);
    return true;
  });
}

export const defaultPersonalisation = 35;

function padDay(n: number) {
  return String(n).padStart(2, "0");
}

function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${padDay(d.getMonth() + 1)}-${padDay(d.getDate())}`;
}

export { addDaysIso };

/** Calendar day cells spanning past/future around the demo today. */
export function calendarDays(centerIso = DEMO_TODAY, past = 14, future = 21) {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return Array.from({ length: past + future + 1 }, (_, i) => {
    const iso = addDaysIso(centerIso, i - past);
    const d = new Date(`${iso}T12:00:00`);
    return {
      iso,
      day: d.getDate(),
      short: labels[d.getDay()],
      month: months[d.getMonth()],
      isToday: iso === DEMO_TODAY,
    };
  });
}

/** Upcoming days for legacy pick helpers (demo week from DEMO_TODAY). */
export function pickDayOptions(fromIso = DEMO_TODAY, count = 7) {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return Array.from({ length: count }, (_, i) => {
    const iso = addDaysIso(fromIso, i);
    const d = new Date(`${iso}T12:00:00`);
    return {
      iso,
      label: `${labels[d.getDay()]} ${d.getDate()} Jul`,
    };
  });
}

/** Resolve mock display dates → ISO for filter matching. */
export function listingIsoDate(listing: CityListing): string | null {
  if (!listing.date) return null;
  if (/^Wednesdays$/i.test(listing.date)) return DEMO_TODAY; // recurring Wed
  const m = listing.date.match(/(\d{1,2})\s*Jul/i);
  if (!m) return null;
  return `2026-07-${padDay(Number(m[1]))}`;
}

function hashId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

const DEFAULT_TIMES = [
  "09:30–11:00",
  "12:00–13:30",
  "14:00–16:00",
  "17:30–19:00",
  "18:00–20:00",
  "19:00–22:00",
  "10:00–16:00",
];

const DEFAULT_ORGANISERS = [
  "Newcastle City Council",
  "Our Toon hosts",
  "Quayside Partners",
  "Community Trust",
  "Independent organiser",
];

/** Fill display fields for map popup / cards when mock data omits them. */
export function listingDetails(listing: CityListing) {
  const seed = hashId(listing.id);
  const placesTotal = listing.placesTotal ?? 12 + (seed % 28);
  const placesFilled =
    listing.placesFilled ?? Math.min(placesTotal - 1, 3 + (seed % placesTotal));

  return {
    time: listing.time ?? DEFAULT_TIMES[seed % DEFAULT_TIMES.length],
    organiser:
      listing.organiser ?? DEFAULT_ORGANISERS[seed % DEFAULT_ORGANISERS.length],
    placesFilled,
    placesTotal,
    idVerified:
      listing.idVerified ??
      (listing.category === "volunteering" || seed % 4 === 0),
    image:
      listing.image ??
      `https://picsum.photos/seed/${encodeURIComponent(listing.id)}/480/240`,
  };
}

export type ForYouHighlight = {
  listingId: string;
  title: string;
  venue: string;
  when: string;
  reasons: string[];
  fromGroupChat?: boolean;
};

/** Solid-informed “for you” cards shown bottom-left when connected. */
export const forYouHighlights: ForYouHighlight[] = [
  {
    listingId: "you-town-moor",
    title: "Town Moor litter pick",
    venue: "Town Moor",
    when: "Wed 15 Jul · 18:00",
    reasons: [
      "Interest in sustainability & nature",
      "Free schedule on Wednesday evening",
      "Like-minded people often attend",
    ],
  },
  {
    listingId: "you-friday-folk",
    title: "Folk session — Bigg Market",
    venue: "Bigg Market",
    when: "Fri 18 Jul · evening",
    reasons: [
      "Music preference from your pod",
      "Friday evening marked free",
      "Recommended by a friend",
    ],
  },
  {
    listingId: "you-wobbly-duck",
    title: "The Wobbly Duck",
    venue: "4 Old Eldon Square, NE1 7JG",
    when: "Tonight · 19:00",
    fromGroupChat: true,
    reasons: [
      "Friends arranging a trip to the pub",
      "Recommended by a friend",
    ],
  },
];

export function listingInterests(listing: CityListing): InterestFilter[] {
  const tags = new Set(listing.personalisationTags);
  const interests: InterestFilter[] = [];

  if (tags.has("fitness") || tags.has("wellbeing")) {
    interests.push("fitness");
  }
  if (tags.has("arts")) {
    interests.push("arts");
  }
  if (tags.has("music") || tags.has("nightlife")) {
    interests.push("music");
  }
  if (tags.has("food") || tags.has("lunch")) {
    interests.push("food");
  }
  if (tags.has("craft") || tags.has("diy")) {
    interests.push("craft");
  }
  if (tags.has("literacy") || tags.has("books") || tags.has("reading")) {
    interests.push("books");
  }
  if (tags.has("culture")) {
    interests.push("culture");
  }
  if (tags.has("outdoors")) {
    interests.push("outdoors");
  }
  if (
    tags.has("community") ||
    tags.has("mutual-aid") ||
    tags.has("social") ||
    tags.has("family")
  ) {
    interests.push("community");
  }

  return interests;
}

export type ActivityFilterState = {
  /** ISO dates selected in the calendar; empty = no date filter */
  selectedDates: string[];
  interests: InterestFilter[];
  /** Listing categories from the bottom legend; empty = all */
  categories: ListingCategory[];
  /** Solid-only: keep events that require ID verification */
  idVerifiedOnly: boolean;
};

export const defaultActivityFilters: ActivityFilterState = {
  selectedDates: [],
  interests: [],
  categories: [],
  idVerifiedOnly: false,
};

export function applyActivityFilters(
  listings: CityListing[],
  filters: ActivityFilterState,
): CityListing[] {
  return listings.filter((listing) => {
    const iso = listingIsoDate(listing);
    const details = listingDetails(listing);

    if (filters.selectedDates.length > 0) {
      if (!iso || !filters.selectedDates.includes(iso)) return false;
    }

    if (filters.interests.length > 0) {
      const interests = listingInterests(listing);
      if (!filters.interests.some((i) => interests.includes(i))) return false;
    }

    if (filters.categories.length > 0) {
      if (!filters.categories.includes(listing.category)) return false;
    }

    if (filters.idVerifiedOnly && !details.idVerified) return false;

    return true;
  });
}

