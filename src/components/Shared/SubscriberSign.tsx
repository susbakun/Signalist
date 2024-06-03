import { cn } from '@/utils'
import Tippy from '@tippyjs/react'
import { TbPremiumRights } from 'react-icons/tb'
import { roundArrow } from 'tippy.js'

type SubscriberSignProps = {
  small?: boolean
}

export const SubscriberSign = ({ small }: SubscriberSignProps) => {
  return (
    <Tippy
      content="you're subscribed"
      className="dark:bg-gray-700 bg-gray-900 text-white font-sans
      rounded-md px-1 py-[1px] text-sm"
      delay={[1000, 0]}
      placement="bottom"
      animation="fade"
      arrow={roundArrow}
      duration={10}
      hideOnClick={true}
    >
      <div>
        <TbPremiumRights className={cn('w-6 h-6 text-yellow-400', { 'w-5 h-5': small })} />
      </div>
    </Tippy>
  )
}
