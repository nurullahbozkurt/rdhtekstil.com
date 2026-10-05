import { createClient } from "@supabase/supabase-js";
import { seed } from "../src/lib/content/data";
import { contentStoreSchema } from "../src/lib/content/schema";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Supabase env eksik");
  process.exit(1);
}

const admin = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const parsed = contentStoreSchema.parse(seed);
const { error } = await admin.from("cms_documents").upsert({
  id: "main",
  collection: "content_store",
  data: parsed,
  updated_at: new Date().toISOString(),
});

if (error) {
  console.error("SEED_FAIL", error.message);
  process.exit(1);
}

console.log("SEED_OK", {
  products: parsed.products.length,
  faqs: parsed.faqs.length,
  categories: parsed.categories.length,
  industries: parsed.industries.length,
  caseStudies: parsed.caseStudies.length,
});
