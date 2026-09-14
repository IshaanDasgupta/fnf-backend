import { env } from "@/config/env";
import { ListingModel } from "@/models/listing.model";

export async function getListingRedirect(listingId: string) {
  const listing = await ListingModel.exists({
    _id: listingId,
  });

  if (!listing) {
    throw new Error("Listing not found");
  }

  const playStoreUrl = `https://play.google.com/store/apps/details?id=${env.androidPackageName}`;

  return (
    `intent://property/${listingId}` +
    `#Intent;scheme=${env.appDeeplinkScheme}` +
    `;package=${env.androidPackageName}` +
    `;S.browser_fallback_url=${encodeURIComponent(playStoreUrl)}` +
    `;end`
  );
}
