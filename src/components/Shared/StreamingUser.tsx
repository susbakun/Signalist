import { AccountModel } from '@/shared/models'
import { getAvatarPlaceholder } from '@/utils'
import { Avatar } from 'flowbite-react'
import { ComponentProps } from 'react'
import { TbExternalLink } from 'react-icons/tb'
import { twMerge } from 'tailwind-merge'

type UserPreviewProps = Pick<AccountModel, 'name' | 'username' | 'imageUrl'> & ComponentProps<'div'>

export const StreamingUser = ({ name, username, imageUrl, className }: UserPreviewProps) => {
  const placeholder = getAvatarPlaceholder(name)

  return (
    <>
      <div className={twMerge('flex jusfity-between', className)}>
        <div className="flex gap-2 items-center flex-1">
          <Avatar
            className="border-red-500 dark:border-red-700
            border-2 rounded-full"
            placeholderInitials={placeholder}
            size="md"
            img={imageUrl}
            rounded
          />
          <div className="flex flex-col justify-center">
            <p>{name.toLowerCase()}</p>
            <div className="flex gap-2">
              <p className="text-sm text-gray-600/70 dark:text-white/50">@{username}</p>
            </div>
          </div>
        </div>
        <button className="action-button">
          <TbExternalLink className="w-5 h-5" />
        </button>
      </div>
    </>
  )
}
