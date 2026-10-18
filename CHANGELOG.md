# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Slide over cart drawer opening globally across all pages with keyboard focus management and screen reader accessibility (see spec 0007)
- Multi phase checkout state machine inside the drawer transitioning across reserve bag items, recipient shipping details, order receipt, and order history (see spec 0007)
- Complimentary delivery progress meter tracking progress toward free insured shipping at fifty dollars (see spec 0007)
- Botanical gift packaging option with handwritten card note and courier delivery instructions (see spec 0007)
- Checkout shipping address form with validation and simulated card payment (see spec 0007)
- Printable order confirmation receipt with unique order reference numbers and order number copy tool (see spec 0007)
- Past orders history viewer saving confirmed receipts to browser local storage for later inspection (see spec 0007)
- Authoritative order price verification at `POST /api/orders` to safeguard against price mismatches or unavailable reserves (see spec 0007)

### Changed
- Moved cart drawer mounting to root layout so it opens seamlessly from any route or buy box across the storefront (see spec 0007)
- Expanded order schemas and catalog types to validate shipping addresses, gifting notes, and masked payment records (see spec 0007)
