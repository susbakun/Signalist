import { UserUnfollowModal } from '@/components'
import { ShaerUserButton } from '@/components/Button/ShaerUserButton'
import { followUser, unfollowUser } from '@/features/User/usersSlice'
import { useIsUserSubscribed } from '@/hooks/useIsUserSubscribed'
import { AccountModel } from '@/shared/models'
import { isDarkMode } from '@/utils'
import { useMemo, useState } from 'react'
import { BiMessage } from 'react-icons/bi'
import { IoLockClosed, IoLockOpenOutline } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

type OthersBottomBarProps = {
  userAccount: AccountModel
  myAccount?: AccountModel
}

export const OthersBottomBar = ({ userAccount, myAccount }: OthersBottomBarProps) => {
  const [openUnfollowModal, setOpenUnfollowModal] = useState(false)

  const isFollowed = useMemo(
    () => myAccount?.followings.some((following) => following.username === userAccount.username),
    [myAccount, userAccount]
  )
  const dispatch = useDispatch()

  const { amISubscribed } = useIsUserSubscribed(userAccount)

  const handleFollowUser = () => {
    if (!isFollowed) {
      toast.success(`You followed user @${userAccount.username}`, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode() ? 'dark' : 'light'
      })
      dispatch(
        followUser({
          followerUsername: myAccount?.username,
          followingUsername: userAccount.username
        })
      )
    } else {
      setOpenUnfollowModal(true)
    }
  }

  const handleAcceptUnfollowModal = () => {
    toast.warn(`You unfollowed user @${userAccount.username}`, {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: isDarkMode() ? 'dark' : 'light'
    })
    dispatch(
      unfollowUser({
        followerUsername: myAccount?.username,
        followingUsername: userAccount.username
      })
    )
    setOpenUnfollowModal(false)
  }

  const handleCloseModal = () => {
    setOpenUnfollowModal(false)
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex gap-5">
          <div>
            <button
              onClick={handleFollowUser}
              className="px-2 py-1 bg-primary-link-button
                dark:bg-dark-link-button rounded-md action-button
                text-black/90 dark:text-white"
            >
              {isFollowed ? 'followed' : 'follow'}
            </button>
          </div>
          <div>
            <Link
              to="/messages"
              className="px-2 py-1 bg-primary-link-button
                dark:bg-dark-link-button rounded-md action-button
                text-black/90 dark:text-white flex"
            >
              <BiMessage className="w-5 h-6" />
            </Link>
          </div>
          {userAccount.hasPremium && (
            <div>
              <Link
                to="premium"
                className="px-2 py-1 bg-gradient-to-r
                    dark:from-dark-link-button from-primary-link-button to-[#ff00e5]
                    dark:to-[#ff00e5] rounded-md action-button
                  text-white flex gap-1 items-center"
              >
                {amISubscribed ? 'charge premium' : 'premium'}
                {amISubscribed ? <IoLockOpenOutline /> : <IoLockClosed />}
              </Link>
            </div>
          )}
        </div>
        <ShaerUserButton />
      </div>
      <UserUnfollowModal
        username={userAccount.username}
        openModal={openUnfollowModal}
        handleCloseModal={handleCloseModal}
        handleAcceptUnfollowModal={handleAcceptUnfollowModal}
      />
    </>
  )
}
