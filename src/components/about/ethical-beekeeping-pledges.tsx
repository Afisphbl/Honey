import React from "react";
import { BeekeepingPledge } from "@/types/catalog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  HeartHandshake,
  Snowflake,
  Leaf,
  Award,
  Sparkles,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface EthicalBeekeepingPledgesProps {
  pledges: BeekeepingPledge[];
  className?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  "heart-handshake": HeartHandshake,
  snowflake: Snowflake,
  leaf: Leaf,
  award: Award,
};

const CATEGORY_TAGS: Record<string, string> = {
  hive_welfare: "Colony Welfare Pledge",
  raw_purity: "Extraction Integrity",
  terroir_conservation: "Ecological Stewardship",
  fair_trade: "Economic Equity",
};

/**
 * Ethical Beekeeping Pledges component highlighting our foundational commitments
 * to colony health, untouched honey reserves, and generational beekeeper equity.
 * Satisfies AC-5.
 */
export function EthicalBeekeepingPledges({
  pledges,
  className,
}: EthicalBeekeepingPledgesProps) {
  return (
    <section
      id="ethical-pledges"
      aria-labelledby="ethical-pledges-heading"
      className={cn("w-full py-12 sm:py-16 bg-amber-50/40 border-t border-amber-200/50", className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-amber-100/80 text-amber-900 border border-amber-200/70">
              <Shield size={18} aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-900">
              Living Principles
            </span>
          </div>
          <h2
            id="ethical-pledges-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal leading-[1.15]"
          >
            Ethical Apiculture & Regenerative Stewardship
          </h2>
          <p className="mt-4 font-sans text-base sm:text-lg text-charcoal/80 leading-relaxed">
            Industrial beekeeping treats colonies like disposable inputs in mono culture orchards.
            Our practices invert that dynamic: honeybees are wild partners whose health, winter honey
            reserves, and botanical forage always take precedence over production targets.
          </p>
        </div>

        {/* Four Pledges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {pledges.map((pledge) => {
            const Icon = ICON_MAP[pledge.badgeIcon] ?? Sparkles;
            const categoryLabel = CATEGORY_TAGS[pledge.category] ?? "Stewardship";

            return (
              <Card
                key={pledge.id}
                className="bg-cream/95 border-amber-200/80 hover:border-amber-400 transition-colors duration-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="p-3 rounded-2xl bg-amber-100/90 text-amber-900 border border-amber-200/80 shadow-2xs">
                        <Icon size={24} aria-hidden="true" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/60 px-3 py-1 rounded-full border border-amber-200/60">
                        {categoryLabel}
                      </span>
                    </div>

                    <CardTitle className="font-serif text-xl sm:text-2xl font-bold text-charcoal mt-4 leading-tight">
                      {pledge.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3.5 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                    <p className="font-semibold text-amber-950 text-sm sm:text-base border-l-2 border-amber-700 pl-3 italic">
                      &ldquo;{pledge.statement}&rdquo;
                    </p>
                    <p>{pledge.details}</p>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
