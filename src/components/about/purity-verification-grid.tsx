import React from "react";
import { PurityStandard } from "@/types/catalog";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Microscope,
  Droplets,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Building2,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PurityVerificationGridProps {
  standards: PurityStandard[];
  className?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  microscope: Microscope,
  droplets: Droplets,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
};

/**
 * Laboratory Purity Verification section displaying independent NMR spectroscopy,
 * sub-18% moisture calibration, trace pesticide screens, and raw enzyme vitality.
 * Satisfies AC-4.
 */
export function PurityVerificationGrid({
  standards,
  className,
}: PurityVerificationGridProps) {
  return (
    <section
      id="purity-standards"
      aria-labelledby="purity-standards-heading"
      className={cn("w-full py-12 sm:py-16", className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-amber-100/80 text-amber-900 border border-amber-200/70">
              <FlaskConical size={18} aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-900">
              Scientific Verification
            </span>
          </div>
          <h2
            id="purity-standards-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal leading-[1.15]"
          >
            Laboratory Purity Standards & Chemical Transparency
          </h2>
          <p className="mt-4 font-sans text-base sm:text-lg text-charcoal/80 leading-relaxed">
            The global honey market is plagued by adulteration with cheap syrups and heavy heating.
            We subject every batch to independent nuclear resonance spectroscopy, moisture assays,
            and 450 pesticide screens before bottling in UV protective glass.
          </p>
        </div>

        {/* Four Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {standards.map((standard) => {
            const Icon = ICON_MAP[standard.badgeIcon] ?? ShieldCheck;

            return (
              <Card
                key={standard.id}
                className="bg-cream/90 border-amber-200/80 hover:border-amber-400 transition-colors duration-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="p-3 rounded-2xl bg-amber-100/90 text-amber-900 border border-amber-200/80 shadow-2xs">
                        <Icon size={24} aria-hidden="true" />
                      </div>
                      <Badge variant="gold" size="sm">
                        {standard.verificationMetric}
                      </Badge>
                    </div>

                    <CardTitle className="font-serif text-xl sm:text-2xl font-bold text-charcoal mt-4 leading-tight">
                      {standard.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                    <p>{standard.description}</p>

                    <div className="pt-3 border-t border-amber-200/50 space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle2
                          size={15}
                          className="text-amber-800 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="text-charcoal font-medium">
                          <strong className="text-amber-950 font-semibold">
                            Threshold:
                          </strong>{" "}
                          {standard.thresholdRequirement}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <FlaskConical
                          size={15}
                          className="text-amber-800 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="text-charcoal/80">
                          <strong className="text-amber-950 font-semibold">
                            Testing Method:
                          </strong>{" "}
                          {standard.testingMethod}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="px-6 pb-6 pt-3 mt-2 border-t border-amber-200/40 flex items-center gap-2 text-xs text-charcoal/70">
                  <Building2 size={14} className="text-amber-800 shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    Issuing Authority: {standard.issuingAuthority}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
