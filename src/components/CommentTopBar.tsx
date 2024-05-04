import { CommentModel } from '@/shared/models'
import { formatDateFromMS, getAvatarPlaceholder } from '@/utils'
import { Avatar } from 'flowbite-react'
import moment from 'jalali-moment'
import { MoreOptionsButton } from './MoreOptionsButton'

type CommentTopBarProps = {
  user: CommentModel['publisher']
  date: CommentModel['date']
}

export const CommentTopBar = ({ user, date }: CommentTopBarProps) => {
  const placeholder = getAvatarPlaceholder(user.name)
  const postDate = formatDateFromMS(date)
  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center">
        <Avatar placeholderInitials={placeholder} size="md" img={user.imageUrl} rounded />
        <div className="flex flex-col justify-center">
          <p>{user.name.toLowerCase()}</p>
          <div className="flex gap-2">
            <p className="text-sm text-gray-600/70 dark:text-white/50">@{user.username}</p>
            <p className="detail-text">{moment(postDate).startOf('m').fromNow()}</p>
          </div>
        </div>
      </div>
      <MoreOptionsButton isForComment username={user.username} />
    </div>
  )
}
