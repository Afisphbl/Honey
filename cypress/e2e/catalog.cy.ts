describe("Product Catalog & Tasting Notes E2E (Spec 0005)", () => {
  it("AC-1: Visit / and navigate to /catalog via header navigation", () => {
    cy.visit("/");
    cy.get("header").should("be.visible");
    cy.get('a[href="/catalog"]').first().click();
    cy.url({ timeout: 10000 }).should("include", "/catalog");

    // Editorial terroir manifesto & header
    cy.get("h1").contains("Artisanal Honey Varieties & Tasting Profiles").should("be.visible");
    cy.contains("Every jar reflects an unrepeatable snapshot").should("be.visible");
    cy.contains("2026 Apiary Reserves").should("be.visible");
    cy.contains("Pure Cold Spun Harvests").should("be.visible");

    // Purity badges
    cy.contains("100% Raw").should("be.visible");
    cy.contains("Single Origin").should("be.visible");
    cy.contains("Cold Spun").should("be.visible");
    cy.contains("UV Protected").should("be.visible");

    // Responsive card grid renders
    cy.get("#catalog-product-grid").should("be.visible");
    cy.screenshot("catalog-ac1-landing");
  });

  it("AC-2 & AC-3: Click Infusions category filter tab and verify URL and grid", () => {
    cy.visit("/catalog");
    cy.get('button[role="tab"]').contains("Infusions").click();
    cy.url().should("include", "/catalog?category=infusion");

    // Grid filters to Mountain Lavender Infusion
    cy.contains("Mountain Lavender Infusion").should("be.visible");
    cy.contains("Raw Wildflower Reserve").should("not.exist");
    cy.contains("Pure Acacia Blossom").should("not.exist");
    cy.screenshot("catalog-ac2-infusions-filter");
  });

  it("AC-2 & AC-3: Change sort dropdown to Price: Low to High and verify URL and order", () => {
    cy.visit("/catalog");
    cy.get("#catalog-sort-select").select("price_asc");
    cy.url().should("include", "/catalog?sort=price_asc");

    // The first card should be the lowest price ($34.00 Raw Wildflower Reserve)
    cy.get("#catalog-product-grid article").first().within(() => {
      cy.contains("Raw Wildflower Reserve").should("be.visible");
      cy.contains("$34.00").should("be.visible");
    });
    cy.screenshot("catalog-ac2-sort-price-asc");
  });

  it("AC-2 & AC-3: Toggle In Stock Only switch and verify URL update", () => {
    cy.visit("/catalog");
    cy.get('input[role="switch"]').check({ force: true });
    cy.url().should("include", "/catalog?inStock=true");
    cy.screenshot("catalog-ac2-in-stock-toggle");
  });

  it("AC-4: On Raw Wildflower Reserve card, click 500g pill and Add to Bag", () => {
    cy.visit("/catalog");
    cy.contains("Raw Wildflower Reserve")
      .parents("article")
      .first()
      .within(() => {
        // Initially 250g jar is selected at $34.00
        cy.contains("$34.00").should("be.visible");

        // Click 500g pill
        cy.get('button[role="radio"]').contains("500g").click();
        cy.contains("$58.00").should("be.visible");
        cy.contains("$68.00").should("be.visible");
        cy.contains("Save 15%").should("be.visible");

        // Click Add to Bag
        cy.contains("Add to Bag").click();
      });

    // Cart drawer should open with updated subtotal
    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Your Reserve Bag").should("be.visible");
    cy.contains("500g Kitchen Reserve Jar").should("be.visible");
    cy.contains("$58.00").should("be.visible");
    cy.screenshot("catalog-ac4-cart-drawer-open");
  });

  it("AC-5 & AC-6: Expand tasting drawer on Mountain Lavender Infusion", () => {
    cy.visit("/catalog");
    cy.contains("Mountain Lavender Infusion")
      .parents("article")
      .first()
      .within(() => {
        // Click Inspect Tasting Profile
        cy.get('button[aria-controls^="tasting-panel"]')
          .should("have.attr", "aria-expanded", "false")
          .click();

        // Should expand to true
        cy.get('button[aria-controls^="tasting-panel"]')
          .should("have.attr", "aria-expanded", "true");

        // Verify sensory ratings
        cy.contains("Sweetness").should("be.visible");
        cy.contains("3/5").should("be.visible");
        cy.contains("Aroma Intensity").should("be.visible");
        cy.contains("4/5").should("be.visible");

        // Color and texture
        cy.contains("Soft Luminous Gold").should("be.visible");
        cy.contains("Micro fine creamy crystal spread").should("be.visible");

        // Floral sources & food pairings
        cy.contains("True Lavender").should("be.visible");
        cy.contains("Ricotta salata").should("be.visible");
      });
    cy.screenshot("catalog-ac5-sensory-drawer-expanded");
  });

  it("AC-4 & AC-7: Apiary Reserve Tasting Flight card verification and cart addition", () => {
    cy.visit("/catalog");
    cy.contains("Apiary Reserve Tasting Flight")
      .parents("article")
      .first()
      .within(() => {
        // Badges and chips
        cy.contains("Gift Box Edition").should("be.visible");
        cy.contains("Save $26.00 (23%)").should("be.visible");
        cy.contains("3 x 125g Tasting Jars Included").should("be.visible");
        cy.contains("Raw Wildflower Reserve").should("be.visible");
        cy.contains("Pure Acacia Blossom").should("be.visible");
        cy.contains("Mountain Lavender Infusion").should("be.visible");

        // Add flight to bag
        cy.contains("Add Tasting Flight to Bag").click();
      });

    // Cart drawer opens with tasting flight
    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Apiary Reserve Tasting Flight").should("be.visible");
    cy.contains("$88.00").should("be.visible");
    cy.screenshot("catalog-ac7-flight-cart-added");
  });

  it("AC-3: Normalize unknown URL parameters cleanly without crashing", () => {
    cy.visit("/catalog?category=unknown_terroir&sort=cheapest");
    // Should normalize cleanly to all products
    cy.contains("Raw Wildflower Reserve").should("be.visible");
    cy.contains("Pure Acacia Blossom").should("be.visible");
    cy.contains("Mountain Lavender Infusion").should("be.visible");
    cy.screenshot("catalog-ac3-normalized-params");
  });
});
