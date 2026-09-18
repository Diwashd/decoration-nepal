# NepWed Gap Analysis and Action Plan

**Prepared:** September 10, 2026  
**Reviewed site:** https://www.nepwed.com/  
**Purpose:** Convert the public-site audit into an actionable product, engineering, trust, and growth backlog.

> This document is based on a public black-box review of the live website and the repository deployment context. Authenticated user workflows, payment provider accounts, production database contents, and admin-only operations were not independently verified.

## Executive summary

NepWed has a strong foundation: Nepal-focused vendor discovery, venue and service categories, NPR pricing, Bikram Sambat wedding dates, vendor profiles, registration roles, and a broader wedding-planning product direction.

The most important work is to make the existing experience reliable and complete before expanding the feature set:

1. Repair broken account recovery and incomplete routes.
2. Make the mobile navigation fully usable.
3. Establish credible vendor verification and review trust.
4. Turn vendor inquiries into a structured lead and quote workflow.
5. Add a complete booking, payment, cancellation, and receipt lifecycle.
6. Connect the checklist, budget, guests, invitations, Lagan calendar, and wedding website into one wedding workspace.
7. Resolve the NepWed versus 11:11 branding and deployment inconsistency.

## Priority definitions

- **P0 — Blocker:** Broken, unsafe, or trust-damaging functionality. Fix before growth campaigns or major feature work.
- **P1 — High:** Directly affects conversion, retention, marketplace liquidity, or credibility.
- **P2 — Medium:** Important product quality, operational efficiency, or growth improvement.
- **P3 — Later:** Useful enhancement after the core marketplace and planning loop work.

## P0: Reliability and trust blockers

### P0-01: Repair password recovery

**Observed gap:** The login page exposes “Forgot password?”, but `/forgot-password` returns a Page Not Found screen.

**Needs to be done:**

- Add a working forgot-password page.
- Add a secure password-reset request endpoint.
- Generate short-lived, single-use reset tokens.
- Store only a hashed reset token, with expiry and consumed state.
- Send a reset email through a configured provider.
- Add a reset-password page with password confirmation and validation.
- Invalidate existing sessions after a successful password reset.
- Return a generic response so email existence is not disclosed.
- Add rate limiting and audit logging.
- Add an expired, invalid, already-used, and successful-reset state.

**Acceptance criteria:**

- A registered user can request a reset and complete it using a valid token.
- Invalid and expired tokens cannot change a password.
- Reusing a consumed token fails safely.
- The UI does not reveal whether an email address is registered.
- The flow works on mobile and has no dead-end route.

### P0-02: Audit all advertised links and routes

**Observed gap:** Footer and product copy advertise planning tools and policy pages. Several public URLs initially rendered only the common shell while client content loaded, and some advertised capabilities were not clearly available to an unauthenticated visitor.

**Needs to be done:**

- Build a route inventory from navigation, footer, homepage cards, and sitemap.
- Check every route for a valid page, loading state, empty state, error state, and mobile layout.
- Remove, hide, or label unfinished links as “Coming soon.”
- Add automated smoke checks for all public routes.
- Ensure client-rendered routes show a useful loading skeleton rather than an empty main region.

**Acceptance criteria:**

- Every visible internal link reaches an intentional page.
- No production navigation link returns an unexpected 404.
- Data-dependent pages have loading, empty, error, and retry states.

### P0-03: Resolve brand and deployment configuration mismatch

**Observed gap:** The live site is branded NepWed, while [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) describes “11:11 Decoration Nepal” and includes unrelated default branding and credentials.

**Needs to be done:**

- Decide the canonical product and company name.
- Update `NEXT_PUBLIC_APP_NAME`, metadata, copy, email templates, and deployment documentation.
- Remove stale “11:11 Decoration Nepal” references if NepWed is the production product.
- Remove default/demo production credentials from deployment documentation.
- Rotate any credentials that may have been exposed or used outside local development.
- Confirm domain, sitemap, robots, analytics, and social-preview configuration use the canonical brand.

**Acceptance criteria:**

- The same brand name and logo are used in the site, metadata, emails, deployment guide, and admin surfaces.
- No production password is documented in the repository.
- A clean production deployment can be performed from the updated guide.

### P0-04: Replace placeholder social links

**Observed gap:** Public footer social links use `#!` instead of real profile URLs.

**Needs to be done:**

- Replace placeholder links with verified NepWed social accounts.
- If an account does not exist, remove that icon or use a real contact destination.
- Add `aria-label`, `rel="noopener noreferrer"`, and meaningful accessible names.
- Track outbound social clicks if analytics is enabled.

**Acceptance criteria:**

- Every visible social icon opens a valid intended destination.
- No public social link points to `#!`.

## P1: Marketplace conversion and vendor trust

### P1-01: Add structured vendor inquiry

**Observed gap:** Vendor profiles offer “Send Inquiry,” but the public experience does not demonstrate a structured request containing the information vendors need to respond.

**Needs to be done:**

- Add an inquiry form with:
  - event date or date range;
  - event type and ceremony type;
  - city and venue;
  - guest count;
  - required services;
  - budget range;
  - contact preference;
  - message and attachment support.
- Pre-fill vendor and user context.
- Save inquiry history for the couple.
- Notify the vendor and couple.
- Add duplicate-submission protection and spam controls.
- Add inquiry status: `new`, `viewed`, `responded`, `quoted`, `booked`, `closed`.

**Acceptance criteria:**

- A couple can send a complete inquiry from a vendor profile.
- The vendor can view and respond to the lead.
- The couple can see the inquiry status and conversation history.
- Notifications do not expose private information unnecessarily.

### P1-02: Define and implement vendor verification

**Observed gap:** Listings prominently display “Verified” or “Unverified,” but the verification criteria are not clear.

**Needs to be done:**

- Define verification levels, for example:
  - identity/contact verified;
  - business document verified;
  - portfolio verified;
  - completed-booking verified.
- Capture verification evidence and verification date.
- Display a tooltip or explanation for each badge.
- Add admin review, approval, rejection, and re-verification flows.
- Add “Report inaccurate listing” functionality.
- Add vendor ownership claim flow.
- Add a verification renewal process.

**Acceptance criteria:**

- A visitor can understand why a vendor is verified.
- Admins can see verification evidence and audit history.
- Vendors cannot claim verification without an approved workflow.
- Users can report incorrect or misleading information.

### P1-03: Improve reviews and ratings

**Observed gap:** Star ratings and review counts are prominent, but review text, source, authenticity, and vendor response capabilities are not sufficiently visible.

**Needs to be done:**

- Show written reviews and review dates.
- Add verified-booking or verified-inquiry labels where applicable.
- Add review sorting and filtering.
- Allow vendor responses.
- Add review reporting and moderation.
- Prevent duplicate or self-generated reviews.
- Show the rating distribution, not only the average.
- Add photo/video reviews in a later iteration.

**Acceptance criteria:**

- Users can inspect the evidence behind a rating.
- Vendors can respond without editing the customer review.
- Admins can moderate reported reviews.
- Review counts and averages are calculated consistently.

### P1-04: Add vendor package and availability information

**Observed gap:** Some profiles show broad price ranges, but couples cannot easily compare inclusions or confirm availability.

**Needs to be done:**

- Add package cards with inclusions, exclusions, add-ons, capacity, duration, and price.
- Add availability calendar or date-request workflow.
- Add service-area and travel-fee information.
- Add expected response time.
- Add cancellation and rescheduling policy.
- Add portfolio media with captions and categories.

**Acceptance criteria:**

- A couple can compare at least two package options.
- A vendor can mark dates unavailable or respond with availability.
- Pricing clearly distinguishes starting price, fixed package price, and estimate.

### P1-05: Add shortlist and compare

**Needs to be done:**

- Allow users to bookmark vendors without losing the list on refresh.
- Add shortlist folders by service or ceremony.
- Add compare view for price, rating, location, verification, packages, and availability.
- Add sharing with a partner or family delegate.

**Acceptance criteria:**

- A signed-in user can save and remove vendors.
- A user can compare a small set of vendors side by side.
- Shared shortlist permissions are explicit.

## P1: Complete booking and commercial flow

### P1-06: Build quote and negotiation workflow

**Needs to be done:**

- Let vendors convert inquiries into quotes.
- Include line items, taxes/fees, discounts, add-ons, validity date, and notes.
- Support quote revisions and acceptance/rejection.
- Preserve an immutable quote history.
- Notify both parties of quote changes.

**Acceptance criteria:**

- A vendor can issue a quote from a lead.
- A couple can accept or reject a quote.
- Both sides can see the current quote and prior revisions.

### P1-07: Add booking confirmation and contract records

**Needs to be done:**

- Add booking status and booking reference.
- Capture service date, parties, deliverables, amount, and cancellation terms.
- Add terms acceptance and timestamp.
- Generate a downloadable booking summary or contract record.
- Add cancellation and dispute states.

**Acceptance criteria:**

- An accepted quote can become a booking.
- The booking record is visible to both parties.
- Cancellation rules are shown before confirmation.

### P1-08: Integrate Nepal-relevant payments

**Needs to be done:**

- Select and document supported providers, such as eSewa, Khalti, cards, or bank transfer.
- Start with deposits if full marketplace escrow is too large for the first release.
- Add payment intent, success, failure, pending, refund, and receipt states.
- Reconcile provider webhooks idempotently.
- Store no raw card data.
- Add admin payment and refund records.

**Acceptance criteria:**

- A user can see exactly what they are paying and why.
- Failed and pending payments are recoverable.
- Successful payments generate receipts and update booking status.
- Refund and cancellation behavior is documented and testable.

## P1: Unified wedding planning workspace

### P1-09: Create a couple dashboard

**Needs to be done:**

- Create one dashboard for:
  - wedding date and Lagan;
  - ceremonies and timeline;
  - checklist progress;
  - budget summary;
  - guests and RSVP summary;
  - shortlisted vendors;
  - inquiries, quotes, and bookings;
  - invitations;
  - wedding website;
  - family/delegate activity.
- Add onboarding that asks only for information needed to personalize the workspace.
- Add progress indicators and next-best actions.

**Acceptance criteria:**

- A signed-in couple can reach all planning features from one workspace.
- The dashboard reflects real saved data rather than marketing-only cards.
- A user can resume planning after signing out and back in.

### P1-10: Nepali wedding checklist and ceremony timeline

**Needs to be done:**

- Support multi-day events and multiple ceremonies.
- Include configurable Nepali traditions and regional variations.
- Add due dates relative to the wedding date.
- Assign tasks to family members or helpers.
- Add task notes, attachments, and completion history.
- Allow custom tasks.

**Acceptance criteria:**

- A couple can select relevant ceremonies and receive a tailored checklist.
- Tasks can be assigned and tracked by another authorized collaborator.
- The checklist adapts when the wedding date changes.

### P1-11: Budget tracker

**Needs to be done:**

- Add NPR-first budgeting with optional currency support.
- Add planned, quoted, paid, and remaining amounts.
- Add categories for venue, food, clothing, jewellery, photography, decoration, transport, rituals, invitations, and contingency.
- Connect vendor quotes and bookings to budget line items.
- Add export and sharing permissions.

**Acceptance criteria:**

- Totals are consistent across dashboard, categories, and exports.
- A user can distinguish estimates from committed and paid amounts.
- Budget data is private by default.

### P1-12: Guest management and RSVP

**Needs to be done:**

- Support households and individual guests.
- Add ceremony-specific RSVP.
- Add meal, accommodation, transport, and accessibility preferences.
- Add invitee tags and relationship groups.
- Add import/export.
- Add QR or check-in support in a later release.

**Acceptance criteria:**

- A couple can create, import, edit, and export a guest list.
- Guests can respond per event or ceremony.
- The couple can see totals by RSVP status and ceremony.

### P1-13: Invitations and wedding website

**Needs to be done:**

- Add Nepali and English invitation templates.
- Connect invitation recipients to guest records.
- Support RSVP links, email, SMS, and WhatsApp-compatible sharing where compliant.
- Track delivery and RSVP status.
- Add wedding website templates with preview before publishing.
- Support story, photos, event details, map, dress code, registry/gift guidance, and privacy settings.
- Provide a shareable URL and unpublish/delete controls.

**Acceptance criteria:**

- A couple can create a preview invitation and website without losing work.
- Published content can be updated or unpublished.
- Invitation recipients map to guest records and RSVP responses.

## P1: Mobile, localization, and accessibility

### P1-14: Complete mobile navigation

**Observed gap:** At a 390px viewport the desktop navigation links disappear, but there is no clear replacement menu.

**Needs to be done:**

- Add a visible hamburger/menu control on small screens.
- Include Vendors, Venues, Lagan, Login, Sign Up, and primary planning CTA.
- Trap focus within the open menu and support Escape to close.
- Prevent background scrolling while the menu is open.
- Add active-route indication.

**Acceptance criteria:**

- Every primary route is reachable at 320px, 390px, and 430px widths.
- The menu is keyboard and screen-reader accessible.
- No horizontal overflow is introduced.

### P1-15: Complete English/Nepali localization

**Needs to be done:**

- Define translation keys rather than duplicating hard-coded text.
- Localize navigation, forms, errors, transactional messages, emails, and planning content.
- Persist language preference.
- Support Nepali numerals and date formatting where appropriate.
- Review translations with native Nepali users.

**Acceptance criteria:**

- Users can switch language from the public site and authenticated workspace.
- The selected language persists across navigation and sessions.
- No major untranslated labels remain in the selected locale.

### P1-16: Accessibility baseline

**Needs to be done:**

- Audit keyboard navigation, focus states, labels, contrast, dialog behavior, and form errors.
- Replace emoji-only controls with accessible labels.
- Verify image alt text and decorative-image handling.
- Add semantic headings and landmark structure.
- Test with a screen reader and automated accessibility checks.

**Acceptance criteria:**

- Primary journeys can be completed without a mouse.
- Form errors are announced and associated with fields.
- Interactive controls have accessible names.

## P2: Support, operations, and growth

### P2-01: Vendor onboarding and portal

- Add a prominent “List your business” entry point.
- Add vendor onboarding steps and document upload.
- Add profile completeness score.
- Add lead inbox, response templates, availability, quote tools, and analytics.
- Define vendor pricing: subscription, qualified lead, commission, or hybrid.

### P2-02: Support and dispute operations

- Add FAQ and help center.
- Add support request and ticket status.
- Add vendor/user reporting flows.
- Add dispute escalation for bookings, payments, reviews, and listing accuracy.
- Publish expected support response times.

### P2-03: Notifications

- Add notification preferences.
- Support email first; evaluate SMS and WhatsApp for high-value transactional events.
- Notify users about new inquiries, quote changes, RSVP changes, upcoming deadlines, and payment states.
- Add opt-out controls and delivery logs.

### P2-04: SEO and discoverability

- Use route-specific titles and descriptions.
- Add canonical URLs.
- Add structured data for organization, local business, vendor, service, review, breadcrumb, and event pages.
- Add Open Graph/Twitter image metadata.
- Create indexable city/category pages with useful copy.
- Keep sitemap and robots output aligned with real routes.

### P2-05: Proof and content

- Add real customer testimonials with permission.
- Publish completed-wedding case studies.
- Explain verification and review methodology publicly.
- Add regional and tradition-specific planning guides.
- Replace unsupported or stale marketplace counts with current, auditable metrics.

### P2-06: Analytics and product measurement

- Define a privacy-conscious event taxonomy.
- Track search, filter, profile view, inquiry, quote, booking, signup, and planning-tool activation.
- Build a funnel dashboard.
- Add error monitoring and route health monitoring.
- Monitor slow API/database calls and client-side errors.

## P3: Later enhancements

- Vendor map and map-based discovery.
- AI-assisted planning recommendations.
- Guest seating chart.
- Ceremony budget templates by region/tradition.
- QR check-in and event-day attendance.
- Collaborative comments and activity feed.
- Photo/video review uploads.
- Vendor availability synchronization.
- Referral and loyalty programs.
- Native mobile application or installable PWA.

## Suggested implementation order

### Sprint 1: Stabilize production

- P0-01 Password recovery.
- P0-02 Route/link audit.
- P0-03 Brand and deployment cleanup.
- P0-04 Real social links.
- P1-14 Mobile navigation.
- Add smoke tests for all public routes.

### Sprint 2: Establish trust and lead capture

- P1-01 Structured inquiry.
- P1-02 Verification model.
- P1-03 Review improvements.
- P1-04 Package and availability data.
- P2-02 Support and reporting foundations.

### Sprint 3: Connect the marketplace

- P1-05 Shortlist and compare.
- P1-06 Quotes.
- P1-07 Booking records.
- P2-03 Notifications.
- P2-06 Analytics funnel.

### Sprint 4: Complete monetization

- P1-08 Payments.
- Refund and cancellation handling.
- Vendor portal and lead management.
- Admin reconciliation and reporting.

### Sprint 5: Build the planning workspace

- P1-09 Couple dashboard.
- P1-10 Checklist and ceremony timeline.
- P1-11 Budget.
- P1-12 Guests and RSVP.

### Sprint 6: Invitations and growth

- P1-13 Invitations and wedding website.
- P1-15 Localization.
- P1-16 Accessibility.
- P2-04 SEO.
- P2-05 Proof and content.

## Definition of done for the public product

The product should not be considered marketplace-ready until:

- Password recovery works end to end.
- Every visible link resolves to a real, intentional experience.
- Mobile users can reach all primary journeys.
- Vendor verification criteria are published and enforced.
- Reviews have visible evidence and moderation controls.
- A couple can send an inquiry, receive a quote, accept it, and see a booking record.
- Payment, cancellation, refund, and receipt states are defined.
- Planning tools are accessible from one authenticated workspace.
- The Nepali/English experience is coherent.
- Production branding, metadata, domain, documentation, and environment variables are consistent.
- Monitoring, analytics, support, and error handling are in place.

## Recommended first three fixes

If only three items can be started immediately:

1. **Fix password recovery and audit all visible routes.**
2. **Implement structured vendor inquiries with verification/review trust signals.**
3. **Resolve the brand/deployment mismatch and add a complete mobile navigation menu.**

