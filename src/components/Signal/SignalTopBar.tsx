import { MoreOptionsButton, SubscriberSign } from "@/components"
import { SignalModel } from "@/shared/models"
import { getAvatarPlaceholder } from "@/utils"
import { Avatar } from "flowbite-react"
import moment from "jalali-moment"
import { Link } from "react-router-dom"

type SignalTopBarProps = {
  publisher: SignalModel["publisher"]
  date: SignalModel["date"]
  signalId: SignalModel["id"]
  subscribed?: boolean
}

export const SignalTopBar = ({ date, publisher, signalId, subscribed }: SignalTopBarProps) => {
  const placeholder = getAvatarPlaceholder(publisher.name)
  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center">
        <Avatar placeholderInitials={placeholder} size="md" img={publisher.imageUrl} rounded />
        <Link to={`/${publisher.username}`} className="flex flex-col justify-center">
          <p className="text-sm md:text-base">{publisher.name.toLowerCase()}</p>
          <div className="flex flex-col md:flex-row md:gap-2">
            <p className="text-xs md:text-sm text-gray-600/70 dark:text-white/50">
              @{publisher.username}
            </p>
            <p className="text-xs md:text-sm detail-text">{moment(date).startOf("m").fromNow()}</p>
          </div>
        </Link>
      </div>
      <div className="flex gap-2 md:gap-4 items-center">
        {subscribed && <SubscriberSign small />}
        <MoreOptionsButton signalId={signalId} username={publisher.username} />
      </div>
    </div>
  )
}
