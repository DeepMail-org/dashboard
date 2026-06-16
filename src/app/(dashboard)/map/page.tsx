"use client";

import dynamic from "next/dynamic";

const MapPageContent = dynamic(
  () => import("@/components/maps/map-page-content"),
  { ssr: false },
);

export default function MapPage() {
  return <MapPageContent />;
}
