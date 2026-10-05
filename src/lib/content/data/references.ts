import type { ContentStoreInput } from "../schema";

/**
 * Referans markalar.
 * TODO(content): Logo dosyaları `public/reference-images/` altına eklenince `logo` alanı doldurulacak;
 * o zamana kadar marka adı yazı olarak (işaretli placeholder) gösterilir.
 * TODO(content): Her marka için sitede kullanım izni RDH tarafından teyit edilecek (`permissionConfirmed`).
 */
export const references: ContentStoreInput["references"] = [
  {
    id: "troisdorf-jets",
    name: "Troisdorf Jets",
    logo: null,
    categories: ["football", "fan"],
    permissionConfirmed: false,
    sortOrder: 1,
  },
  {
    id: "warriors-football",
    name: "Warriors Football",
    logo: null,
    categories: ["football", "fan"],
    permissionConfirmed: false,
    sortOrder: 2,
  },
  {
    id: "ecs-crocodiles",
    name: "ECS Crocodiles",
    logo: null,
    categories: ["football", "fan"],
    permissionConfirmed: false,
    sortOrder: 3,
  },
  {
    id: "sv-grun-weiss-annaburg",
    name: "SV Grün-Weiss Annaburg",
    logo: null,
    categories: ["football", "fan"],
    permissionConfirmed: false,
    sortOrder: 4,
  },
  {
    id: "ski-club-trosel",
    name: "Ski-Club Trösel",
    logo: null,
    categories: ["football"],
    permissionConfirmed: false,
    sortOrder: 5,
  },
  {
    id: "krattigen",
    name: "Krattigen",
    logo: null,
    categories: ["fan"],
    permissionConfirmed: false,
    sortOrder: 6,
  },
  {
    id: "tinder",
    name: "Tinder",
    logo: null,
    categories: ["corporate"],
    permissionConfirmed: false,
    sortOrder: 7,
  },
  {
    id: "es",
    name: "ES",
    logo: null,
    categories: ["private-label"],
    permissionConfirmed: false,
    sortOrder: 8,
  },
];
