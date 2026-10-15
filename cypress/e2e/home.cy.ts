describe("Storefront Home Page E2E (covers AC-1, AC-3, AC-6)", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads the home page and displays the brand title and foundation badge (AC-1)", () => {
    cy.contains("Honey").should("be.visible");
    cy.contains("Foundation Ready").should("be.visible");
  });

  it("displays the luxury editorial hero headline and subtitle (AC-3)", () => {
    cy.get("h1").should("contain.text", "Liquid Gold, Directly from the Wild Flora.");
    cy.contains("Artisanal Apiculture & Single-Origin Reserve").should("be.visible");
    cy.contains("Crafted with raw extraction methods and unpasteurized purity.").should("be.visible");
  });

  it("displays the hero animation sequence poster asset (AC-6)", () => {
    cy.get('img[alt="Honey jar animation sequence poster frame"]').should("be.visible");
    cy.contains("Canvas Asset Pipeline Verified").should("be.visible");
    cy.contains("150 frames converted to WebP").should("be.visible");
  });

  it("displays the three architecture foundation verification cards (AC-1)", () => {
    cy.contains("Next.js App Router").should("be.visible");
    cy.contains("Tailwind CSS v4 & OKLCH").should("be.visible");
    cy.contains("Zustand & Memory Bounded Canvas").should("be.visible");
  });

  it("verifies accessible landmark structure across the storefront", () => {
    cy.get("main").should("exist");
    cy.get("header").should("exist");
    cy.get("footer").should("contain.text", "Honey Artisanal Storefront · Stack & Architecture Foundation");
  });
});
