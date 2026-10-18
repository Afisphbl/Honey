import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EthicalBeekeepingPledges } from "../ethical-beekeeping-pledges";
import { BeekeepingPledge } from "@/types/catalog";

const MOCK_PLEDGES: BeekeepingPledge[] = [
  {
    id: "hive-welfare-first",
    title: "Colony Welfare Over Extraction Yield",
    category: "hive_welfare",
    statement: "We never feed synthetic corn syrup or strip colonies of their essential winter sustenance.",
    details: "Expanded details on colony welfare.",
    badgeIcon: "heart-handshake",
  },
  {
    id: "cold-gravity-extraction",
    title: "Raw Cold Extraction Guarantee",
    category: "raw_purity",
    statement: "Zero flash heating, zero pressure microfiltration, zero artificial additives.",
    details: "Expanded details on raw cold extraction.",
    badgeIcon: "snowflake",
  },
];

describe("EthicalBeekeepingPledges component (satisfies AC-5)", () => {
  it("renders ethical pledges heading and category tags (AC-5)", () => {
    render(<EthicalBeekeepingPledges pledges={MOCK_PLEDGES} />);

    expect(
      screen.getByRole("heading", {
        name: /ethical apiculture & regenerative stewardship/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText("Colony Welfare Pledge")).toBeInTheDocument();
    expect(screen.getByText("Extraction Integrity")).toBeInTheDocument();
  });

  it("displays pledge statements and stewardship details (AC-5)", () => {
    render(<EthicalBeekeepingPledges pledges={MOCK_PLEDGES} />);

    expect(
      screen.getByText("Colony Welfare Over Extraction Yield")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We never feed synthetic corn syrup or strip colonies/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Zero flash heating, zero pressure microfiltration/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText("Expanded details on colony welfare.")
    ).toBeInTheDocument();
  });
});
