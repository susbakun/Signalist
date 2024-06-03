import { SubscriptionPlanType } from '@/shared/types'

type SubscriptionBundleType = {
  plan: SubscriptionPlanType[0]
}

export const SubscriptionBundle = ({ plan }: SubscriptionBundleType) => {
  return (
    <div className="subscription-bundle">
      <p>{plan.duration}</p>
      <p>{plan.price}$</p>
    </div>
  )
}
