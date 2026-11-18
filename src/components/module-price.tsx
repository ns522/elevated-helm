import { Editable } from "@/components/editor/editable";
import { PriceTag } from "@/components/chrome";
import { moduleOffer, type Billing, type Pricing } from "@/content/site";

export function ModulePrice({
  billing,
  pricing,
  className,
}: {
  billing: Billing;
  pricing: Pricing;
  className?: string;
}) {
  const offer = moduleOffer({ billing }, pricing);
  if (offer.kind === "included") {
    return <p className={className}>Included with sales and service</p>;
  }

  return (
    <p className={className}>
      <Editable path={offer.path} kind="number" value={String(offer.amount)}>
        <PriceTag amount={offer.amount} />
      </Editable>
      <span className="text-sm text-muted">{offer.suffix}</span>
    </p>
  );
}
