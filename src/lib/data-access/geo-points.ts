export type Severity = "critical" | "high" | "medium" | "low";

export interface GeoMapPoint {
  ip: string;
  lat: number;
  lon: number;
  label: string;
  country: string;
  countryName: string;
  asnOrg: string;
  severity: Severity;
  count: number;
}

// Mock data matching backend GeoPoint proto shape
// TODO: Replace with real API call when backend /dashboard/geo endpoint is ready
export const MOCK_GEO_POINTS: GeoMapPoint[] = [
  { ip: "185.100.87.42", lat: 55.7558, lon: 37.6173, label: "Moscow", country: "RU", countryName: "Russia", asnOrg: "AS12345 JSC Selectel", severity: "critical", count: 847 },
  { ip: "103.224.182.250", lat: 39.9042, lon: 116.4074, label: "Beijing", country: "CN", countryName: "China", asnOrg: "AS4134 CHINANET", severity: "high", count: 623 },
  { ip: "197.210.53.114", lat: 6.5244, lon: 3.3792, label: "Lagos", country: "NG", countryName: "Nigeria", asnOrg: "AS36972 Swift Network", severity: "high", count: 412 },
  { ip: "200.19.189.10", lat: -23.5505, lon: -46.6333, label: "São Paulo", country: "BR", countryName: "Brazil", asnOrg: "AS28573 Claro SA", severity: "medium", count: 298 },
  { ip: "5.160.218.10", lat: 35.6892, lon: 51.3890, label: "Tehran", country: "IR", countryName: "Iran", asnOrg: "AS58224 Iran Cell", severity: "high", count: 234 },
  { ip: "103.152.112.16", lat: 19.0760, lon: 72.8777, label: "Mumbai", country: "IN", countryName: "India", asnOrg: "AS9829 BSNL", severity: "medium", count: 189 },
  { ip: "77.75.74.10", lat: 44.4268, lon: 26.1025, label: "Bucharest", country: "RO", countryName: "Romania", asnOrg: "AS8708 Digital Cable", severity: "medium", count: 156 },
  { ip: "113.160.92.10", lat: 21.0285, lon: 105.8542, label: "Hanoi", country: "VN", countryName: "Vietnam", asnOrg: "AS45899 VNPT", severity: "low", count: 134 },
  { ip: "79.110.201.10", lat: 48.8566, lon: 2.3522, label: "Paris", country: "FR", countryName: "France", asnOrg: "AS12322 Free SAS", severity: "medium", count: 98 },
  { ip: "185.86.151.10", lat: 52.5200, lon: 13.4050, label: "Berlin", country: "DE", countryName: "Germany", asnOrg: "AS34011 wiener cloud", severity: "low", count: 67 },
  { ip: "196.216.2.10", lat: -33.9249, lon: 18.4241, label: "Cape Town", country: "ZA", countryName: "South Africa", asnOrg: "AS36916 MWEB", severity: "low", count: 45 },
  { ip: "202.12.29.10", lat: 35.6762, lon: 139.6503, label: "Tokyo", country: "JP", countryName: "Japan", asnOrg: "AS4713 NTT", severity: "low", count: 34 },
];

// Arc data: threat origins → "home" location (Frankfurt HQ)
export const HOME_LOCATION = { lat: 50.1109, lon: 8.6821, label: "Frankfurt (HQ)" };

export interface GeoArcDatum {
  id: string;
  from: [number, number]; // [lng, lat]
  to: [number, number];
  severity: Severity;
  count: number;
  countryName: string;
}

export function buildArcData(points: GeoMapPoint[]): GeoArcDatum[] {
  return points.map((p, i) => ({
    id: `arc-${i}`,
    from: [p.lon, p.lat],
    to: [HOME_LOCATION.lon, HOME_LOCATION.lat],
    severity: p.severity,
    count: p.count,
    countryName: p.countryName,
  }));
}

export function toGeoJson(points: GeoMapPoint[]): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: points.map((p) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [p.lon, p.lat] },
      properties: { ...p },
    })),
  };
}
