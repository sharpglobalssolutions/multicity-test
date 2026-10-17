import { listFeaturedRoutes } from "@/repositories/route.repository";

/** Mirrors the {name, label, slug, url, type} shape `destination.service.ts`
 * and `airline.service.ts` use, so the footer's four link columns
 * (Top Routes/Countries/Cities/Airlines) all render from one item shape.
 * There's no dedicated route landing page yet, so `url` points at the
 * homepage's on-page destinations section, same as Top Countries/Cities. */
interface PublicRoute {
  name: string;
  label: string;
  slug: string;
  url: string;
  type: "route";
}

export async function listTopRoutes(limit?: number): Promise<PublicRoute[]> {
  const routes = await listFeaturedRoutes(limit);
  return routes.map((route) => ({
    name: route.title,
    label: route.title,
    slug: route.slug,
    url: "#destinations",
    type: "route" as const,
  }));
}
