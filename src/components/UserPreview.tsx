import { AccountModel } from '@/shared/models'
import { getAvatarPlaceholder } from '@/utils'
import { Avatar } from 'flowbite-react'
import { useState } from 'react'
import { UserUnfollowModal } from './UserUnfollowModal'

type UserPreviewProps = AccountModel

export const UserPreview = ({ name, username, imageUrl }: UserPreviewProps) => {
  const [isFollowed, setIsFollowed] = useState(false)
  const [openUnfollowModal, setOpenUnfollowModal] = useState(false)
  const placeholder = getAvatarPlaceholder(name)
  const handleUserFollow = () => {
    if (!isFollowed) {
      setIsFollowed(true)
    } else {
      setOpenUnfollowModal(true)
    }
  }

  const handleAcceptUnfollowModal = () => {
    setIsFollowed(false)
    setOpenUnfollowModal(false)
  }

  const handleCloseMoal = () => {
    setOpenUnfollowModal(false)
  }

  return (
    <>
      <div className="flex jusfity-between">
        <div className="flex gap-2 items-center flex-1">
          <Avatar placeholderInitials={placeholder} size="md" img={imageUrl} rounded />
          <div className="flex flex-col justify-center">
            <p>{name.toLowerCase()}</p>
            <div className="flex gap-2">
              <p className="text-sm text-gray-600/70 dark:text-white/50">@{username}</p>
            </div>
          </div>
        </div>
        <button onClick={handleUserFollow} className="action-button">
          {isFollowed ? 'followed' : 'follow'}
        </button>
      </div>
      <UserUnfollowModal
        username={username}
        openModal={openUnfollowModal}
        handleCloseModal={handleCloseMoal}
        handleAcceptUnfollowModal={handleAcceptUnfollowModal}
      />
    </>
  )
}
