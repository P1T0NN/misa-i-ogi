# About the Company

## What we do

We connect **Accommodations** (apartments, hotels, villas, hostels) with local
**Hospitalities** (restaurants, cafés, night clubs, horse rides, spas, tours —
anything a traveler might want to do or eat). The product is the *bridge*
between where guests sleep and the businesses around them.

## How it works for the guest

1. A guest arrives at an apartment, hotel room, or villa.
2. Inside the unit there is a printed **QR code** tied to that specific
   accommodation.
3. The guest scans it with their phone camera.
4. They land on `/scan/[token]` showing every **benefit** the accommodation has
   negotiated with nearby hospitalities — discounts, free welcome drinks, set
   menus, complimentary upgrades, whatever the partnership offers.
5. **No sign-up. No account. No app install.** Just scan → browse → walk in
   and use the offer.

This zero-friction flow is intentional: we never want a guest to bounce off a
login wall while they're standing in a hotel lobby.

## How it works for our customers

Two sides of the marketplace, both managed through `/admin`:

- **Accommodation owners** register their property, upload a cover image, and
  pick which hospitalities they want to partner with.
- **Hospitality owners** register their venue (one cover image, contact info,
  type) and accept partnerships that send them foot traffic.

The administrator (us, today) curates the data, sets up the partnerships, and
issues the QR codes that get printed and placed in the rooms.

## Data model in one breath

- `accommodations` — a place a guest sleeps. Has an auto-generated `scanToken` that the QR
  points to (`/scan/[token]`).
- `hospitalities` — a place a guest spends money on food, drink, or activities.
- `partnerships` — the join row linking Accommodation X to Hospitality Y.
  Optional `discountPercentage` when the perk is a percent-off offer.

## What we deliberately keep simple

- One cover image per accommodation and per hospitality. No galleries.
- No guest accounts, ever. The QR is the entire authentication story.
- Partnerships are an optional discount percentage on the venue listing. No
  coupon codes, no redemption tracking in v1 — the venue honors the offer on sight.
