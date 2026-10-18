import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PurityVerificationGrid } from "../purity-verification-grid";
import { PurityStandard } from "@/types/catalog";

const MOCK_STANDARDS: PurityStandard[] = [
  {
    id: "nmr-spectral-profiling",
    name: "Nuclear Magnetic Resonance (NMR) Profiling",
    verificationMetric: "100% Botanical Pollen Concordance",
    testingMethod: "High resolution 400 MHz NMR Spectroscopy",
    issuingAuthority: "European Apiculture Purity Laboratory, QSI Bremen",
    thresholdRequirement: "Zero synthetic syrups, zero C4 sugar markers",
    description: "Detailed NMR description text.",
    badgeIcon: "microscope",
  },
  {
    id: "moisture-content-limit",
    name: "Sub-18% Moisture Content Standard",
    verificationMetric: "16.8% Average Harvest Moisture",
    testingMethod: "Digital Refractometric Brix Calibration",
    issuingAuthority: "International Honey Commission (IHC) Standard",
    thresholdRequirement: "Moisture strictly below 18.0%",
    description: "Detailed moisture description text.",
    badgeIcon: "droplets",
  },
];

describe("PurityVerificationGrid component (satisfies AC-4)", () => {
  it("renders laboratory verification section heading and standards cards (AC-4)", () => {
    render(<PurityVerificationGrid standards={MOCK_STANDARDS} />);

    expect(
      screen.getByRole("heading", {
        name: /laboratory purity standards & chemical transparency/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Nuclear Magnetic Resonance (NMR) Profiling")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sub-18% Moisture Content Standard")
    ).toBeInTheDocument();
  });

  it("displays verification metrics, testing methods, and issuing authorities (AC-4)", () => {
    render(<PurityVerificationGrid standards={MOCK_STANDARDS} />);

    expect(
      screen.getByText("100% Botanical Pollen Concordance")
    ).toBeInTheDocument();
    expect(
      screen.getByText("16.8% Average Harvest Moisture")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/High resolution 400 MHz NMR Spectroscopy/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Zero synthetic syrups, zero C4 sugar markers/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/European Apiculture Purity Laboratory, QSI Bremen/i)
    ).toBeInTheDocument();
  });
});
