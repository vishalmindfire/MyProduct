import { allPlans } from "@/app/data/plans";
import type { Plan } from "@/app/data/plans";
import PlanCard from "@/app/components/PlanCard";

type Props = {
  plans?: Plan[];
  /** CTA destination for every card — e.g. "#" on pricing page, "/pricing" on home. */
  ctaHref: string;
  compact?: boolean;
};

export default function PlanGrid({ plans = allPlans, ctaHref, compact = false }: Props) {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <PlanCard key={plan.name} plan={plan} href={ctaHref} compact={compact} />
      ))}
    </div>
  );
}
