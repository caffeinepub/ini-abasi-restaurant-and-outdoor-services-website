# Specification

## Summary
**Goal:** Limit Internet Identity authentication to the admin area while keeping public browsing and order/reservation submissions fully usable without login.

**Planned changes:**
- Remove/hide Login/Logout controls from the public site header/mobile menu and ensure public routes never trigger profile setup prompts.
- Keep /admin protected: require Internet Identity login for admin access via the existing guard behavior.
- Update the Order/Reserve UI to support anonymous submissions by collecting customer contact details (name, phone, optional email).
- Update backend order/reservation creation to accept anonymous callers and persist the captured contact details; keep all admin-only mutations protected by admin checks.
- If backend data models change for anonymous orders/reservations, add/update a safe state migration so existing stored orders remain available after upgrade.

**User-visible outcome:** Visitors can browse the site and submit orders or table reservations without logging in, while admins can log in under /admin to manage all content and view/manage orders (including anonymous submissions with contact details).
