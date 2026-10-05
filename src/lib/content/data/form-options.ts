import type { ContentStoreInput } from "../schema";

type Options = ContentStoreInput["formOptions"];

const quantity: Options = [
  ["50-99", "50–99", "50–99"],
  ["100-249", "100–249", "100–249"],
  ["250-499", "250–499", "250–499"],
  ["500-999", "500–999", "500–999"],
  ["1000-2499", "1.000–2.499", "1,000–2,499"],
  ["2500+", "2.500+", "2,500+"],
].map(([value, tr, en], index) => ({
  type: "quantity" as const,
  value: value as string,
  label: { tr: tr as string, en: en as string },
  sortOrder: index + 1,
}));

const productInterest: Options = [
  ["beanie", "Bere", "Beanie"],
  ["scarf", "Atkı", "Scarf"],
  ["set", "Bere + Atkı Seti", "Beanie + Scarf Set"],
  ["other", "Henüz karar vermedim", "Not decided yet"],
].map(([value, tr, en], index) => ({
  type: "productInterest" as const,
  value: value as string,
  label: { tr: tr as string, en: en as string },
  sortOrder: index + 1,
}));

// TODO(content): Ülke listesi Faz 2'de `form_options` tablosuna taşınacak; şimdilik öncelikli pazarlar.
const country: Options = [
  ["TR", "Türkiye", "Türkiye"],
  ["DE", "Almanya", "Germany"],
  ["AT", "Avusturya", "Austria"],
  ["CH", "İsviçre", "Switzerland"],
  ["NL", "Hollanda", "Netherlands"],
  ["BE", "Belçika", "Belgium"],
  ["FR", "Fransa", "France"],
  ["IT", "İtalya", "Italy"],
  ["ES", "İspanya", "Spain"],
  ["GB", "Birleşik Krallık", "United Kingdom"],
  ["IE", "İrlanda", "Ireland"],
  ["DK", "Danimarka", "Denmark"],
  ["SE", "İsveç", "Sweden"],
  ["NO", "Norveç", "Norway"],
  ["FI", "Finlandiya", "Finland"],
  ["PL", "Polonya", "Poland"],
  ["CZ", "Çekya", "Czechia"],
  ["US", "Amerika Birleşik Devletleri", "United States"],
  ["CA", "Kanada", "Canada"],
  ["AE", "Birleşik Arap Emirlikleri", "United Arab Emirates"],
  ["OTHER", "Diğer", "Other"],
].map(([value, tr, en], index) => ({
  type: "country" as const,
  value: value as string,
  label: { tr: tr as string, en: en as string },
  sortOrder: index + 1,
}));

export const formOptions: Options = [...quantity, ...productInterest, ...country];
