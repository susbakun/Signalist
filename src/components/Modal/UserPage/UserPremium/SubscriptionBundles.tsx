import { AccountModel } from "@/shared/models"
import { SubscriptionBundle } from "./SubscriptionBundle"

type SubscriptionBundlesProps = {
  subscriptionPlan: AccountModel["subscriptionPlan"]
}

export const SubscriptionBundles = ({ subscriptionPlan }: SubscriptionBundlesProps) => {
  if (subscriptionPlan)
    return (
      <div className="flex items-center flex-col font-bold gap-4 px-12">
        <h3 className="text-xl">SUBSCRIPTION BUNDLES</h3>
        {subscriptionPlan.map((plan) => (
          <SubscriptionBundle key={plan.duration} plan={plan} />
        ))}
      </div>
    )
}
