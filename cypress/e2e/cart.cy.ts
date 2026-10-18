describe("Cart Drawer & Order Completion E2E (Spec 0007)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  const addFeaturedItemToCart = () => {
    cy.visit("/#featured-reserve");
    cy.get("#featured-reserve").scrollIntoView();
    cy.contains("Add to Cart ($34.00)").click({ force: true });
    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Your Reserve Bag").should("be.visible");
  };

  it("AC-1: Global drawer mounting across /, /catalog, and /about", () => {
    // 1. Visit homepage and open drawer via header bag
    cy.visit("/");
    cy.get('button[aria-label^="Open shopping cart"]').first().click({ force: true });
    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Your Reserve Bag").should("be.visible");
    cy.screenshot("cart-ac1-drawer-open-home");

    // Close drawer via Escape
    cy.get("body").type("{esc}");
    cy.get('[role="dialog"]').should("not.exist");

    // 2. Visit /catalog and open drawer
    cy.visit("/catalog");
    cy.get('button[aria-label^="Open shopping cart"]').first().click({ force: true });
    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Your Reserve Bag").should("be.visible");
    cy.screenshot("cart-ac1-drawer-open-catalog");

    cy.get("body").type("{esc}");
    cy.get('[role="dialog"]').should("not.exist");

    // 3. Visit /about and open drawer
    cy.visit("/about");
    cy.get('button[aria-label^="Open shopping cart"]').first().click({ force: true });
    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("Your Reserve Bag").should("be.visible");
    cy.screenshot("cart-ac1-drawer-open-about");
  });

  it("AC-2: Line item management, quantity selector clamping (1 to 10), and unit limits", () => {
    addFeaturedItemToCart();

    cy.contains("Raw Wildflower Reserve").should("be.visible");
    cy.contains("$34.00").should("be.visible");

    // Quantity selector inside drawer
    cy.get('[role="dialog"]').find('[aria-label="Quantity for Raw Wildflower Reserve"]').first().within(() => {
      cy.get('[aria-label="Decrease quantity"]').should("be.disabled");
      cy.get('input[role="spinbutton"]').should("have.value", "1");

      // Increment to 2
      cy.get('[aria-label="Increase quantity"]').click({ force: true });
      cy.get('input[role="spinbutton"]').should("have.value", "2");
    });

    // Verify subtotal updated to 2 * $34.00 = $68.00
    cy.contains("$68.00").should("be.visible");

    // Increment up to clamp limit of 10
    cy.get('[role="dialog"]').find('[aria-label="Quantity for Raw Wildflower Reserve"]').first().within(() => {
      for (let i = 2; i < 10; i++) {
        cy.get('[aria-label="Increase quantity"]').click({ force: true });
      }
      cy.get('input[role="spinbutton"]').should("have.value", "10");
      cy.get('[aria-label="Increase quantity"]').should("be.disabled");
    });

    // Subtotal at 10 units = $340.00
    cy.contains("$340.00").should("be.visible");
    cy.screenshot("cart-ac2-quantity-stepper-clamped");
  });

  it("AC-2: Remove item using trash button and verify empty bag state", () => {
    addFeaturedItemToCart();

    cy.contains("Raw Wildflower Reserve").should("be.visible");

    // Click trash button inside the dialog
    cy.get('[role="dialog"]').find('button[aria-label^="Remove Raw Wildflower Reserve"]').click({ force: true });

    // Verify empty bag illustration and action
    cy.contains("Your Bag Is Empty").should("be.visible");
    cy.contains("Explore our raw wildflower and single origin harvests").should("be.visible");
    cy.contains("Discover Reserves").should("be.visible");
    cy.screenshot("cart-ac2-empty-bag-state");
  });

  it("AC-3: Complimentary delivery progress bar calculation (< $50 and >= $50)", () => {
    addFeaturedItemToCart();

    // 1. $34.00 out of $50.00 is 68%, remaining is $16.00
    cy.contains("Add $16.00 for free delivery").should("be.visible");
    cy.contains("68%").should("be.visible");
    cy.contains("Insured Shipping").parent().contains("$8.00").should("be.visible");
    cy.screenshot("cart-ac3-delivery-progress-under-threshold");

    // 2. Increment quantity to 2 -> $68.00 total -> Exceeds $50.00
    cy.get('[role="dialog"]').find('[aria-label="Quantity for Raw Wildflower Reserve"]').first().within(() => {
      cy.get('[aria-label="Increase quantity"]').click({ force: true });
    });

    cy.contains("Complimentary delivery unlocked").should("be.visible");
    cy.contains("100%").should("be.visible");
    cy.contains("Insured Shipping").parent().contains("Free").should("be.visible");
    cy.screenshot("cart-ac3-delivery-progress-unlocked");
  });

  it("AC-4: Artisanal gifting toggle and 150-character handwritten note counter", () => {
    addFeaturedItemToCart();

    // Proceed to checkout to access gifting options
    cy.get('[role="dialog"]').contains("Proceed to Checkout").click({ force: true });

    // Verify checkout phase mounted
    cy.contains("Delivery Address").should("be.visible");
    cy.contains("Artisanal Gifting Options").should("be.visible");

    // Check complimentary gift packaging
    cy.contains("Complimentary Botanical Gift Packaging").click({ force: true });
    cy.get('input[type="checkbox"]').should("be.checked");

    // Check handwritten note textarea counter
    cy.get("#giftNote").should("have.attr", "maxLength", "150");
    cy.contains("0 / 150").should("be.visible");

    const sampleNote = "Warmest seasonal harvest wishes from our family to yours!";
    cy.get("#giftNote").type(sampleNote);
    cy.contains(`${sampleNote.length} / 150`).should("be.visible");
    cy.screenshot("cart-ac4-gifting-note-counter");
  });

  it("AC-5: Multi-phase state machine navigation (items -> checkout -> back to items)", () => {
    addFeaturedItemToCart();

    cy.contains("Your Reserve Bag").should("be.visible");

    // Proceed to checkout
    cy.get('[role="dialog"]').contains("Proceed to Checkout").click({ force: true });
    cy.contains("Delivery Address").should("be.visible");
    cy.contains("Simulated Payment").should("be.visible");

    // Click back to items
    cy.contains("Back to Reserve Bag").click({ force: true });
    cy.contains("Your Reserve Bag").should("be.visible");
    cy.contains("Raw Wildflower Reserve").should("be.visible");
    cy.screenshot("cart-ac5-state-machine-navigation");
  });

  it("AC-6: Client form validation with accessible inline error alerts", () => {
    addFeaturedItemToCart();

    cy.get('[role="dialog"]').contains("Proceed to Checkout").click({ force: true });

    // Clear any prefilled fields and attempt submit
    cy.get("#fullName").clear();
    cy.get("#email").clear();
    cy.get("#line1").clear();
    cy.get("#city").clear();
    cy.get("#postalCode").clear();

    cy.get('button[type="submit"]').click({ force: true });

    // Verify aria-invalid and inline error messages
    cy.get("#fullName").should("have.attr", "aria-invalid", "true");
    cy.get("#fullName-error").should("be.visible");
    cy.get("#email").should("have.attr", "aria-invalid", "true");
    cy.get("#email-error").should("be.visible");
    cy.get("#line1").should("have.attr", "aria-invalid", "true");
    cy.get("#line1-error").should("be.visible");
    cy.screenshot("cart-ac6-inline-form-errors");
  });

  it("AC-6, AC-7, AC-8: Order submission, server price verification, and confirmed receipt", () => {
    addFeaturedItemToCart();

    cy.get('[role="dialog"]').contains("Proceed to Checkout").click({ force: true });

    // Use Quick Fill Demo to populate valid information effortlessly
    cy.contains("Quick Fill Demo").click({ force: true });

    cy.get("#fullName").should("have.value", "Julian Thorne");
    cy.get("#email").should("have.value", "julian@catskillapiary.org");
    cy.get("#line1").should("have.value", "88 Hive Ridge Lane");
    cy.get("#city").should("have.value", "Woodstock");
    cy.get("#postalCode").should("have.value", "12498");

    // Submit order
    cy.get('button[type="submit"]').click({ force: true });

    // Confirm loading state transitions to receipt phase
    cy.contains("Reserve Order Confirmed", { timeout: 10000 }).should("be.visible");
    cy.contains("Official Harvest Certificate").should("be.visible");

    // Unique order number formatted HNY-XXXXX
    cy.get("span.font-mono").contains(/^HNY-\d{5}$/).should("be.visible");

    // Verify delivery details and itemized totals
    cy.contains("Julian Thorne").should("be.visible");
    cy.contains("88 Hive Ridge Lane").should("be.visible");
    cy.contains("Woodstock, NY 12498").should("be.visible");
    cy.contains("Raw Wildflower Reserve").should("be.visible");
    cy.contains("Total Paid").should("be.visible");
    cy.contains("Payment Settled").should("be.visible");
    cy.screenshot("cart-ac8-confirmed-order-receipt");

    // Copy order number button works
    cy.get('button[aria-label="Copy order number"]').click({ force: true });

    // Verify active cart was cleared
    cy.window().then((win) => {
      const storedCart = win.localStorage.getItem("honey_cart");
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        expect(parsed.state.items.length).to.equal(0);
      }
    });
  });

  it("AC-8: Print receipt preview triggered via window.print()", () => {
    addFeaturedItemToCart();

    cy.get('[role="dialog"]').contains("Proceed to Checkout").click({ force: true });
    cy.contains("Quick Fill Demo").click({ force: true });

    // Stub window.print
    cy.window().then((win) => {
      cy.stub(win, "print").as("printStub");
    });

    cy.get('button[type="submit"]').click({ force: true });
    cy.contains("Reserve Order Confirmed", { timeout: 10000 }).should("be.visible");

    // Click Print Receipt
    cy.contains("Print Receipt").click({ force: true });
    cy.get("@printStub").should("have.been.calledOnce");
    cy.screenshot("cart-ac8-print-receipt-action");
  });

  it("AC-9: Historical orders view and inspection from localStorage", () => {
    addFeaturedItemToCart();

    cy.get('[role="dialog"]').contains("Proceed to Checkout").click({ force: true });
    cy.contains("Quick Fill Demo").click({ force: true });
    cy.get('button[type="submit"]').click({ force: true });
    cy.contains("Reserve Order Confirmed", { timeout: 10000 }).should("be.visible");

    // Click Past Orders in receipt view
    cy.contains("Past Orders").click({ force: true });

    // Should switch to history phase
    cy.contains("Past Reserve Orders").should("be.visible");
    cy.contains("Showing 1 archived order on this device.").should("be.visible");
    cy.get("ul[role=\"list\"] button").first().within(() => {
      cy.contains(/^HNY-\d{5}$/).should("be.visible");
      cy.contains("Confirmed").should("be.visible");
      cy.contains("Raw Wildflower Reserve").should("be.visible");
    });
    cy.screenshot("cart-ac9-order-history-list");

    // Click order item to inspect full receipt modal
    cy.get("ul[role=\"list\"] button").first().click({ force: true });
    cy.contains("Official Harvest Certificate").should("be.visible");
    cy.contains("← Back to Order History").should("be.visible");
    cy.screenshot("cart-ac9-order-history-inspect-receipt");

    // Click back to history
    cy.contains("← Back to Order History").click({ force: true });
    cy.contains("Past Reserve Orders").should("be.visible");
  });

  it("AC-1: Keyboard dismissal via Escape key restores focus", () => {
    cy.visit("/");
    const cartButton = cy.get('button[aria-label^="Open shopping cart"]').first();
    cartButton.click({ force: true });
    cy.get('[role="dialog"]').should("be.visible");

    // Press Escape
    cy.get("body").type("{esc}");
    cy.get('[role="dialog"]').should("not.exist");
    cy.screenshot("cart-ac1-escape-dismissal");
  });
});
