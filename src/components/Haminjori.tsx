import { followUser, unfollowUser } from '@/features/User/usersSlice'
import { AccountModel } from '@/shared/models'
import { isDarkMode } from '@/utils'
import Tippy from '@tippyjs/react'
import { useMemo, useState } from 'react'
import { BiMessage } from 'react-icons/bi'
import { IoLockClosed, IoLockOpenOutline, IoShareOutline } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { roundArrow } from 'tippy.js'
import { UserUnfollowModal } from './Modal/UserUnfollowModal'

type HaminjoriProps = {
  followingUsername: AccountModel['username']
  subscribed?: boolean
  follower?: AccountModel
  hasPremium?: boolean
}

export const Haminjori = ({
  followingUsername,
  follower,
  subscribed,
  hasPremium
}: HaminjoriProps) => {
  const [openUnfollowModal, setOpenUnfollowModal] = useState(false)

  const isFollowed = useMemo(
    () => follower?.followings.some((following) => following.username === followingUsername),
    [follower, followingUsername]
  )
  const dispatch = useDispatch()

  const handleFollowUser = () => {
    if (!isFollowed) {
      toast.success(`You followed user @${followingUsername}`, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode() ? 'dark' : 'light'
      })
      dispatch(followUser({ followerUsername: follower?.username, followingUsername }))
    } else {
      setOpenUnfollowModal(true)
    }
  }

  const handleAcceptUnfollowModal = () => {
    toast.warn(`You unfollowed user @${followingUsername}`, {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: isDarkMode() ? 'dark' : 'light'
    })
    dispatch(unfollowUser({ followerUsername: follower?.username, followingUsername }))
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
          {hasPremium && (
            <div>
              <Link
                to="premium"
                className="px-2 py-1 bg-gradient-to-r
                    dark:from-dark-link-button from-primary-link-button to-[#ff00e5]
                    dark:to-[#ff00e5] rounded-md action-button
                  text-white flex gap-1 items-center"
              >
                {subscribed ? 'charge premium' : 'premium'}
                {subscribed ? <IoLockOpenOutline /> : <IoLockClosed />}
              </Link>
            </div>
          )}
        </div>
        <div>
          <Tippy
            content="share user"
            className="dark:bg-gray-700 bg-gray-900 text-white font-sans
                rounded-md px-1 py-[1px] text-sm"
            delay={[1000, 0]}
            placement="top"
            animation="fade"
            arrow={roundArrow}
            duration={10}
            hideOnClick={true}
          >
            <button
              className="action-button
                text-black/90 dark:text-white"
            >
              <IoShareOutline className="w-6 h-6" />
            </button>
          </Tippy>
        </div>
      </div>
      <UserUnfollowModal
        username={followingUsername}
        openModal={openUnfollowModal}
        handleCloseModal={handleCloseModal}
        handleAcceptUnfollowModal={handleAcceptUnfollowModal}
      />
    </>
  )
}
