"use client";

import "@/lib/disableLeaflet3d";
import ListingPopup from "@/components/ListingPopup";
import {
  CATEGORY_LEGEND,
  HOME_PIN,
  NEWCASTLE_CENTER,
  type CityListing,
} from "@/data/mockOurToon";
import { CATEGORY_FA_ICON } from "@/lib/categoryIcons";
import { icon as faIcon } from "@fortawesome/fontawesome-svg-core";
import { faBeerMugEmpty, faBicycle, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";

/** Runtime patch — tiles with translate3d block backdrop-filter sampling. */
if (typeof window !== "undefined") {
  (L.Browser as { any3d: boolean }).any3d = false;
}

type LatLng = [number, number];

type Props = {
  listings: CityListing[];
  solidConnected: boolean;
  focusListingId?: string | null;
  onFocusHandled?: () => void;
  activeRouteListingId?: string | null;
  onConfirmRoute?: (listingId: string) => void;
};

function categoryColor(category: CityListing["category"]) {
  return (
    CATEGORY_LEGEND.find((c) => c.category === category)?.swatch ?? "#3d5a80"
  );
}

function listingIcon(listing: CityListing, forYou: boolean) {
  const color = listing.fromGroupChat
    ? "#7c4dff"
    : categoryColor(listing.category);
  const size = 28;
  const glyph = faIcon(
    listing.fromGroupChat
      ? faBeerMugEmpty
      : CATEGORY_FA_ICON[listing.category],
    {
      styles: { color, width: "11px", height: "11px" },
    },
  ).html.join("");

  const ring = forYou
    ? `box-shadow:
         0 0 0 2px #7c4dff,
         0 2px 8px rgba(124,77,255,0.35);`
    : `box-shadow:
         inset 0 0 0 1.5px color-mix(in srgb, ${color} 70%, white),
         0 1px 4px rgba(20,28,40,0.18);`;

  return L.divIcon({
    className: "map-listing-marker",
    iconSize: [size + 8, size + 8],
    iconAnchor: [(size + 8) / 2, (size + 8) / 2],
    popupAnchor: [0, -(size / 2 + 6)],
    html: `<span style="
      position:relative;
      display:flex;
      align-items:center;
      justify-content:center;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:color-mix(in srgb, ${color} 48%, transparent);
      -webkit-backdrop-filter:blur(10px);
      backdrop-filter:blur(10px);
      ${ring}
    ">${glyph}</span>`,
  });
}

function homeIcon() {
  const color = "#5c6570";
  const glyph = faIcon(faHouse, {
    styles: { color, width: "11px", height: "11px" },
  }).html.join("");

  return L.divIcon({
    className: "map-listing-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    html: `<span style="
      display:flex;
      align-items:center;
      justify-content:center;
      width:28px;
      height:28px;
      border-radius:50%;
      background:color-mix(in srgb, ${color} 42%, transparent);
      -webkit-backdrop-filter:blur(10px);
      backdrop-filter:blur(10px);
      box-shadow:
        inset 0 0 0 1.5px color-mix(in srgb, ${color} 55%, white),
        0 1px 4px rgba(20,28,40,0.16);
    ">${glyph}</span>`,
  });
}

function fallbackRoute(from: LatLng, to: LatLng): LatLng[] {
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;
  const midLat = (lat1 + lat2) / 2 + (lng2 - lng1) * 0.15;
  const midLng = (lng1 + lng2) / 2 - (lat2 - lat1) * 0.15;
  return [from, [midLat, midLng], to];
}

/** Rough cycling ETA at ~15 km/h when OSRM duration is unavailable */
function estimateCycleMinutes(from: LatLng, to: LatLng) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(to[0] - from[0]);
  const dLng = toRad(to[1] - from[1]);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from[0])) *
      Math.cos(toRad(to[0])) *
      Math.sin(dLng / 2) ** 2;
  const metres = 2 * R * Math.asin(Math.sqrt(a));
  return Math.max(1, Math.round(metres / 250));
}

/** DOM overlay (not a Leaflet marker) so backdrop-filter works — markers sit in a transformed pane. */
function CycleEtaChip({
  path,
  minutes,
}: {
  path: LatLng[];
  minutes: number;
}) {
  const map = useMap();
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    const mid = path[Math.floor(path.length / 2)];
    if (!mid) return;

    function update() {
      const point = map.latLngToContainerPoint(mid!);
      // Avoid transform on the chip — it kills backdrop-filter
      setPos({ left: point.x - 48, top: point.y - 14 });
    }

    update();
    map.on("move", update);
    map.on("zoom", update);
    map.on("zoomend", update);
    map.on("moveend", update);
    return () => {
      map.off("move", update);
      map.off("zoom", update);
      map.off("zoomend", update);
      map.off("moveend", update);
    };
  }, [map, path]);

  if (!pos) return null;

  const floatLayer =
    typeof document !== "undefined"
      ? document.getElementById("map-float-layer")
      : null;
  if (!floatLayer) return null;

  return createPortal(
    <div
      className="pointer-events-none absolute flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-bold text-solid"
      style={{
        left: pos.left,
        top: pos.top,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        WebkitBackdropFilter: "blur(12px)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 14px rgba(20, 28, 40, 0.12)",
      }}
      aria-label={`Cycle route, about ${minutes} minutes`}
    >
      <FontAwesomeIcon icon={faBicycle} className="size-3" />
      <span>{minutes} min</span>
    </div>,
    floatLayer,
  );
}

function InvalidateSize({ deps }: { deps: unknown }) {
  const map = useMap();
  useEffect(() => {
    const refresh = () => map.invalidateSize();
    const t = window.setTimeout(refresh, 80);
    window.addEventListener("resize", refresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", refresh);
    };
  }, [map, deps]);
  return null;
}

function FocusableMarker({
  listing,
  forYou,
  focusListingId,
  onFocusHandled,
  routeActive,
  onConfirmRoute,
}: {
  listing: CityListing;
  forYou: boolean;
  focusListingId?: string | null;
  onFocusHandled?: () => void;
  routeActive: boolean;
  onConfirmRoute?: (listingId: string) => void;
}) {
  const markerRef = useRef<L.Marker | null>(null);
  const map = useMap();

  useEffect(() => {
    if (!focusListingId || focusListingId !== listing.id) return;
    const marker = markerRef.current;
    if (!marker) return;

    map.setView([listing.lat, listing.lng], Math.max(map.getZoom(), 14), {
      animate: true,
    });
    marker.openPopup();
    onFocusHandled?.();
  }, [focusListingId, listing, map, onFocusHandled]);

  return (
    <Marker
      ref={markerRef}
      position={[listing.lat, listing.lng]}
      icon={listingIcon(listing, forYou)}
      zIndexOffset={forYou ? 200 : 0}
    >
      <Popup maxWidth={280} minWidth={260} className="listing-popup-root">
        <ListingPopup
          listing={listing}
          highlight={forYou}
          routeActive={routeActive}
          onConfirmRoute={
            listing.fromGroupChat ? onConfirmRoute : undefined
          }
        />
      </Popup>
    </Marker>
  );
}

function RouteOverlay({
  destination,
}: {
  destination: CityListing;
}) {
  const map = useMap();
  const [path, setPath] = useState<LatLng[]>(() =>
    fallbackRoute(
      [HOME_PIN.lat, HOME_PIN.lng],
      [destination.lat, destination.lng],
    ),
  );
  const [minutes, setMinutes] = useState(() =>
    estimateCycleMinutes(
      [HOME_PIN.lat, HOME_PIN.lng],
      [destination.lat, destination.lng],
    ),
  );

  useEffect(() => {
    let cancelled = false;
    const from: LatLng = [HOME_PIN.lat, HOME_PIN.lng];
    const to: LatLng = [destination.lat, destination.lng];

    async function loadRoute() {
      try {
        const url = `https://router.project-osrm.org/route/v1/bike/${HOME_PIN.lng},${HOME_PIN.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("route failed");
        const data = (await res.json()) as {
          routes?: {
            duration: number;
            geometry: { coordinates: [number, number][] };
          }[];
        };
        const route = data.routes?.[0];
        const coords = route?.geometry?.coordinates;
        if (!coords?.length) throw new Error("empty route");
        if (cancelled) return;
        const next: LatLng[] = coords.map(([lng, lat]) => [lat, lng]);
        setPath(next);
        setMinutes(Math.max(1, Math.round((route?.duration ?? 0) / 60)));
        map.fitBounds(L.latLngBounds(next), { padding: [48, 48], maxZoom: 15 });
      } catch {
        if (cancelled) return;
        const next = fallbackRoute(from, to);
        setPath(next);
        setMinutes(estimateCycleMinutes(from, to));
        map.fitBounds(L.latLngBounds(next), { padding: [48, 48], maxZoom: 15 });
      }
    }

    void loadRoute();
    return () => {
      cancelled = true;
    };
  }, [destination.lat, destination.lng, map]);

  return (
    <>
      <Polyline
        positions={path}
        pathOptions={{
          color: "#7c4dff",
          weight: 5,
          opacity: 0.85,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      <CycleEtaChip path={path} minutes={minutes} />
    </>
  );
}

function HomeMarker() {
  return (
    <Marker
      position={[HOME_PIN.lat, HOME_PIN.lng]}
      icon={homeIcon()}
      zIndexOffset={300}
    >
      <Popup>
        <div className="text-xs">
          <p className="font-bold text-ncc-ink">{HOME_PIN.label}</p>
          <p className="text-ncc-muted">{HOME_PIN.postcode} · home</p>
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapPanel({
  listings,
  solidConnected,
  focusListingId,
  onFocusHandled,
  activeRouteListingId,
  onConfirmRoute,
}: Props) {
  const routeDestination =
    listings.find((l) => l.id === activeRouteListingId) ?? null;

  return (
    <MapContainer
      center={[NEWCASTLE_CENTER.lat, NEWCASTLE_CENTER.lng]}
      zoom={13}
      maxZoom={16}
      minZoom={11}
      className="h-full w-full"
      scrollWheelZoom
      zoomControl={false}
      zoomAnimation={false}
      fadeAnimation={false}
      markerZoomAnimation={false}
    >
      <InvalidateSize deps={listings.length} />
      <ZoomControl position="topright" />
      <TileLayer
        attribution='Tiles &copy; Esri &mdash; Esri, TomTom, FAO, NOAA, USGS'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        maxZoom={16}
        maxNativeZoom={16}
      />
      <TileLayer
        attribution=""
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
        maxZoom={16}
        maxNativeZoom={16}
        opacity={0.85}
      />
      {listings.map((listing) => {
        const forYou = solidConnected && listing.personalMatch >= 0.65;
        return (
          <FocusableMarker
            key={listing.id}
            listing={listing}
            forYou={forYou}
            focusListingId={focusListingId}
            onFocusHandled={onFocusHandled}
            routeActive={activeRouteListingId === listing.id}
            onConfirmRoute={onConfirmRoute}
          />
        );
      })}
      {solidConnected ? <HomeMarker /> : null}
      {routeDestination ? (
        <RouteOverlay destination={routeDestination} />
      ) : null}
    </MapContainer>
  );
}
