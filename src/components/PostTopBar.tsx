import { PostModel } from '@/shared/models'
import { formatDateFromMS, getAvatarPlaceholder } from '@/utils'
import { Avatar } from 'flowbite-react'
import moment from 'jalali-moment'
import { MoreOptionsButton } from './MoreOptionsButton'

type PostUserInfoProps = PostModel['publisher'] & {
  date: PostModel['date']
  postId: PostModel['id']
}

export const PostTopBar = ({ postId, name, username, imageUrl, date }: PostUserInfoProps) => {
  const placeholder = getAvatarPlaceholder(name)
  const postDate = formatDateFromMS(date)
  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center">
        <Avatar placeholderInitials={placeholder} size="md" img={imageUrl} rounded />
        <div className="flex flex-col justify-center">
          <p>{name.toLowerCase()}</p>
          <div className="flex gap-2">
            <p className="text-sm text-gray-600/70 dark:text-white/50">@{username}</p>
            <p className="detail-text">{moment(postDate).startOf('m').fromNow()}</p>
          </div>
        </div>
      </div>
      <MoreOptionsButton postId={postId} username={username} />
    </div>
  )
}
