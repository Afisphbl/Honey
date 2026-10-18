describe("Brand Heritage & Apiary Story E2E (Spec 0006)", () => {
  it("AC-1: Navigate to /about from header link and verify editorial proclamation, anchors, and sections", () => {
    cy.visit("/");
    cy.get("header").should("be.visible");
    cy.get('a[href="/about"]').contains("Brand Heritage & Apiaries").first().click();
    cy.url({ timeout: 10000 }).should("include", "/about");

    // Editorial proclamation title & manifesto
    cy.get("h1").should("contain.text", "The Living Story of Our Apiaries & Terroirs").and("be.visible");
    cy.contains("We practice slow apiculture").should("be.visible");
    cy.contains("Apiculture Heritage & Terroir").should("be.visible");
    cy.contains("Slow Harvest Philosophy").should("be.visible");

    // In-page anchor pills
    cy.get('a[href="#terroir-atlas"]').should("contain.text", "Terroir Atlas").and("be.visible");
    cy.get('a[href="#seasonal-cycle"]').should("contain.text", "Seasonal Harvest").and("be.visible");
    cy.get('a[href="#purity-standards"]').should("contain.text", "Purity Standards").and("be.visible");
    cy.get('a[href="#ethical-pledges"]').should("contain.text", "Ethical Pledges").and("be.visible");

    // Verify all four core sections exist
    cy.get("#terroir-atlas").should("be.visible");
    cy.get("#seasonal-cycle").should("be.visible");
    cy.get("#purity-standards").should("be.visible");
    cy.get("#ethical-pledges").should("be.visible");

    cy.screenshot("about-ac1-landing");
  });

  it("AC-2 & AC-6: Click Plateau de Valensole origin tab and verify shallow URL, terroir metrics, and reserve jar", () => {
    cy.visit("/about");
    cy.get('#origin-tab-valensole-plateau').click();
    cy.url().should("include", "origin=valensole-plateau");

    // Verify origin panel content
    cy.get('#origin-panel-valensole-plateau').within(() => {
      cy.contains("590m Elevation").should("be.visible");
      cy.contains("Henri Martin").should("be.visible");
      cy.contains("32 Hives").should("be.visible");
      cy.contains("Mediterranean highland").should("be.visible");
      cy.contains("Fragrant lavender fields and wild thyme undergrowth").should("be.visible");

      // Verify harvested lot reserve link
      cy.contains("Mountain Lavender Infusion").should("be.visible");
      cy.contains("Inspect Reserve").should("be.visible");
    });

    cy.screenshot("about-ac2-valensole-terroir");
  });

  it("AC-3 & AC-6: Click Autumn pill in Seasonal Harvest Cycle and verify URL and blooms", () => {
    cy.visit("/about");
    cy.get('#season-tab-autumn').click();
    cy.url().should("include", "season=autumn");

    cy.get('#season-panel-autumn').within(() => {
      cy.contains("August to September").should("be.visible");
      cy.contains("Autumn Harvest & Comb Pressing").should("be.visible");
      cy.contains("Cold comb extraction").should("be.visible");
      cy.contains("Purple Loosestrife").should("be.visible");
    });

    cy.screenshot("about-ac3-autumn-harvest");
  });

  it("AC-3 & AC-7: Switch to Winter season pill and verify quiescence badge and dormancy empty state", () => {
    cy.visit("/about");
    cy.get('#season-tab-winter').click();
    cy.url().should("include", "season=winter");

    cy.get('#season-panel-winter').within(() => {
      cy.contains("Colony In Quiescence").should("be.visible");
      cy.contains("Resting for next harvest").should("be.visible");
      cy.contains("October to March").should("be.visible");
      cy.contains("Explore Current Catalog").should("be.visible").and("have.attr", "href", "/catalog");
    });

    cy.screenshot("about-ac7-winter-quiescence");
  });

  it("AC-4: Inspect Laboratory Purity Verification section and badges", () => {
    cy.visit("/about");
    cy.get("#purity-standards").within(() => {
      cy.contains("100% Botanical Pollen Concordance").should("be.visible");
      cy.contains("Nuclear Magnetic Resonance (NMR) Profiling").should("be.visible");
      cy.contains("16.8% Average Harvest Moisture").should("be.visible");
      cy.contains("0.00 ppm Synthetic Contaminants").should("be.visible");
      cy.contains("> 18 Diastase Enzyme Units").should("be.visible");
      cy.contains("QSI Bremen").should("be.visible");
    });

    cy.screenshot("about-ac4-purity-standards");
  });

  it("AC-5: Inspect Ethical Beekeeping Pledges section and commitments", () => {
    cy.visit("/about");
    cy.get("#ethical-pledges").within(() => {
      cy.contains("Colony Welfare Over Extraction Yield").should("be.visible");
      cy.contains("Raw Cold Extraction Guarantee").should("be.visible");
      cy.contains("Wildflower Terroir Conservation").should("be.visible");
      cy.contains("Fair Trade Apiary Stewardship").should("be.visible");
    });

    cy.screenshot("about-ac5-ethical-pledges");
  });

  it("AC-6: Normalize unknown origin and season query parameters cleanly", () => {
    cy.visit("/about?origin=unknown_peak&season=monsoon");
    // Should fall back silently to Catskill Highlands and Spring
    cy.get('#origin-panel-catskill-highlands').should("be.visible");
    cy.contains("Catskill Highlands, New York").should("be.visible");
    cy.get('#season-panel-spring').should("be.visible");
    cy.contains("Spring Awakening & Early Blossom").should("be.visible");

    cy.screenshot("about-ac6-normalized-parameters");
  });

  it("AC-8: Keyboard navigation across origin tabs and season tabs", () => {
    cy.visit("/about");

    // Origin tabs keyboard navigation
    cy.get('#origin-tab-catskill-highlands')
      .focus()
      .should("have.attr", "aria-selected", "true")
      .type("{rightarrow}");

    cy.get('#origin-tab-black-forest-foothills')
      .should("have.focus")
      .and("have.attr", "aria-selected", "true");

    cy.url().should("include", "origin=black-forest-foothills");

    // Season tabs keyboard navigation
    cy.get('#season-tab-spring')
      .focus()
      .should("have.attr", "aria-selected", "true")
      .type("{rightarrow}");

    cy.get('#season-tab-summer')
      .should("have.focus")
      .and("have.attr", "aria-selected", "true");

    cy.url().should("include", "season=summer");
    cy.screenshot("about-ac8-keyboard-navigation");
  });

  it("AC-8: Respect prefers-reduced-motion media preference", () => {
    cy.visit("/about", {
      onBeforeLoad(win) {
        cy.stub(win, "matchMedia")
          .withArgs("(prefers-reduced-motion: reduce)")
          .returns({
            matches: true,
            media: "(prefers-reduced-motion: reduce)",
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => true,
          });
      },
    });

    cy.get('#origin-tab-valensole-plateau').click();
    cy.get('#origin-panel-valensole-plateau').should("be.visible");
    cy.screenshot("about-ac8-reduced-motion");
  });

  it("AC-1: Click closing reserve invitation button and navigate to /catalog", () => {
    cy.visit("/about");
    cy.get("#reserve-invitation").should("be.visible");
    cy.contains("Explore the Reserve Catalog").click();
    cy.url({ timeout: 10000 }).should("include", "/catalog");
    cy.get("h1").should("contain.text", "Artisanal Honey Varieties & Tasting Profiles").and("be.visible");
    cy.screenshot("about-ac1-catalog-invitation-navigated");
  });
});
