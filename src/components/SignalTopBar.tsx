import { SignalModel } from '@/shared/models'
import { getAvatarPlaceholder } from '@/utils'
import { Avatar } from 'flowbite-react'
import moment from 'jalali-moment'
import { MoreOptionsButton } from './Button/MoreOptionsButton/MoreOptionsButton'

type SignalTopBarProps = {
  publisher: SignalModel['publisher']
  date: SignalModel['date']
  signalId: SignalModel['id']
}

export const SignalTopBar = ({ date, publisher, signalId }: SignalTopBarProps) => {
  const placeholder = getAvatarPlaceholder(publisher.username)
  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center">
        <Avatar placeholderInitials={placeholder} size="md" img={publisher.imageUrl} rounded />
        <div className="flex flex-col justify-center">
          <p>{publisher.name.toLowerCase()}</p>
          <div className="flex gap-2">
            <p className="text-sm text-gray-600/70 dark:text-white/50">@{publisher.username}</p>
            <p className="detail-text">{moment(date).startOf('m').fromNow()}</p>
          </div>
        </div>
      </div>
      <MoreOptionsButton signalId={signalId} username={publisher.username} />
    </div>
  )
}
