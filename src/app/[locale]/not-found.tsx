import { NotFoundContent } from "@/components/site/not-found-content";
import { locales } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { getSiteSettings } from "@/lib/content";
import { getLinks } from "@/lib/routing";

export default async function NotFound() {
  const entries = await Promise.all(
    locales.map(async (locale) => {
      const messages = getMessages(locale);
      const [links, settings] = await Promise.all([getLinks(locale), getSiteSettings(locale)]);
      return [
        locale,
        {
          ...messages.notFound,
          products: settings.ctas.browseProducts,
          homeHref: links.home(),
          productsHref: links.page("products"),
        },
      ] as const;
    }),
  );
  return <NotFoundContent texts={Object.fromEntries(entries)} />;
}
