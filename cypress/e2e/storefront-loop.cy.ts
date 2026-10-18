describe("Core Storefront Loop & Scroll Hero E2E (Spec 0004)", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("verifies AC-1 & AC-6: sticky header with Honey wordmark and Bag count pill showing 0", () => {
    cy.get("header").should("be.visible");
    cy.get("header").contains("Honey").should("be.visible");
    cy.get("header").contains("Single Origin Reserve").should("be.visible");
    cy.get("header").contains("Bag").should("be.visible");
    cy.get("header").contains("0").should("be.visible");
  });

  it("verifies AC-1, AC-2, AC-3, AC-4: full viewport canvas hero exists without visible frame counter numbers", () => {
    cy.get("#hero-scroll-track").should("be.visible");
    cy.get("canvas").should("be.visible");
    cy.get("h1").contains("Liquid Gold, Directly from the Wild Flora.").should("be.visible");

    // AC-4: Uncluttered cinematic presentation omitting any frame progression number pill (e.g. 001 / 150)
    cy.contains("001 / 150").should("not.exist");
    cy.contains("frame 1 of 150").should("not.exist");
  });

  it("verifies AC-5 & AC-6: variant switching, quantity stepper, add to cart, and cart drawer loop", () => {
    // Scroll down to featured reserve section
    cy.get("#featured-reserve").scrollIntoView();
    cy.contains("Raw Wildflower Reserve").should("be.visible");

    // Initial state: 250g jar is default at $34.00
    cy.contains("$34.00").should("be.visible");

    // Select 500g variant with force click to clear sticky header coordinate
    cy.get('button[role="radio"]').contains("500g").click({ force: true });
    cy.contains("$58.00").should("be.visible");
    cy.contains("$68.00").should("be.visible");
    cy.contains("Save 15%").should("be.visible");

    // Increase quantity stepper to 2
    cy.get('button[aria-label="Increase quantity"]').click({ force: true });
    cy.contains("Add to Cart ($116.00)").should("be.visible");

    // Click Add to Cart
    cy.contains("Add to Cart ($116.00)").click({ force: true });

    // Verify optimistic header cart counter badge increments to 2
    cy.get("header").contains("2").should("be.visible");

    // Verify slide-over cart drawer opens
    cy.contains("Your Reserve Bag").should("be.visible");
    cy.contains("2 jars in order").should("be.visible");
    cy.contains("$116.00").should("be.visible");
    cy.contains("Complimentary delivery unlocked").should("be.visible");

    // In cart drawer, decrement quantity to 1
    cy.get('[role="dialog"]').find('button[aria-label="Decrease quantity"]').click({ force: true });
    cy.contains("1 jar in order").should("be.visible");
    cy.contains("$58.00").should("be.visible");

    // Capture visual verification screenshot
    cy.screenshot("storefront-cart-drawer-open");
  });
});
