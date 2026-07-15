/** Must load before `leaflet` so panes skip translate3d (needed for backdrop-filter). */
if (typeof window !== "undefined") {
  (
    window as unknown as { L_DISABLE_3D?: boolean }
  ).L_DISABLE_3D = true;
}
