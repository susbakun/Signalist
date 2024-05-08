import { UserUnfollowModal } from '@/components'
import { followUser, unfollowUser } from '@/features/User/usersSlice'
import { AccountModel } from '@/shared/models'
import { getAvatarPlaceholder, isDarkMode } from '@/utils'
import { Avatar } from 'flowbite-react'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

type UserPreviewProps = AccountModel & {
  follower: AccountModel
}

export const UserPreview = ({ name, username, imageUrl, follower }: UserPreviewProps) => {
  const isFollowed = useMemo(
    () => follower.followings.some((followingUsername) => followingUsername === username),
    [follower, username]
  )
  const [openUnfollowModal, setOpenUnfollowModal] = useState(false)

  const placeholder = getAvatarPlaceholder(name)
  const dispatch = useDispatch()

  const handleUserFollow = () => {
    if (!isFollowed) {
      toast.success(`You followed user @${username}`, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode() ? 'dark' : 'light'
      })
      dispatch(followUser({ followerUsername: follower.username, followingUsername: username }))
    } else {
      setOpenUnfollowModal(true)
    }
  }

  const handleAcceptUnfollowModal = () => {
    toast.warn(`You unfollowed user @${username}`, {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: isDarkMode() ? 'dark' : 'light'
    })
    dispatch(unfollowUser({ followerUsername: follower.username, followingUsername: username }))
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
        {follower.username !== username && (
          <button onClick={handleUserFollow} className="action-button">
            {isFollowed ? 'followed' : 'follow'}
          </button>
        )}
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
