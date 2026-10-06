/** Admin panelinde ülke kodu → Türkçe ad. Form seçenekleriyle uyumlu tutulur. */
const COUNTRY_LABELS_TR: Record<string, string> = {
  TR: "Türkiye",
  DE: "Almanya",
  AT: "Avusturya",
  CH: "İsviçre",
  NL: "Hollanda",
  BE: "Belçika",
  FR: "Fransa",
  IT: "İtalya",
  ES: "İspanya",
  GB: "Birleşik Krallık",
  IE: "İrlanda",
  DK: "Danimarka",
  SE: "İsveç",
  NO: "Norveç",
  FI: "Finlandiya",
  PL: "Polonya",
  CZ: "Çekya",
  US: "Amerika Birleşik Devletleri",
  CA: "Kanada",
  AE: "Birleşik Arap Emirlikleri",
  OTHER: "Diğer",
};

/** Örn. `TR · Türkiye` — bilinmeyen kodlarda yalnızca kod döner. */
export function formatCountryLabel(code: string | null | undefined): string {
  if (!code?.trim()) return "—";
  const normalized = code.trim().toUpperCase();
  const name = COUNTRY_LABELS_TR[normalized];
  if (!name) return code.trim();
  if (normalized === "OTHER") return name;
  return `${normalized} · ${name}`;
}
