import type { ContentStoreInput } from "../schema";
import { caseStudies } from "./case-studies";
import { categories } from "./categories";
import { faqs } from "./faqs";
import { formOptions } from "./form-options";
import { industries } from "./industries";
import { legalPages } from "./legal";
import { pages } from "./pages";
import { products } from "./products";
import { references } from "./references";
import { siteSettings } from "./site-settings";

/** Faz 1 seed verisi. Faz 3'te bu veri Supabase'e aktarılacak. */
export const seed: ContentStoreInput = {
  siteSettings,
  pages,
  categories,
  products,
  industries,
  references,
  caseStudies,
  faqs,
  formOptions,
  legalPages,
};
