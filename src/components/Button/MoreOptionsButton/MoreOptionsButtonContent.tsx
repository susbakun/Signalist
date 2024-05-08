import { blockUser, deletePost } from '@/features/Post/postsSlice'
import { followUser, unfollowUser } from '@/features/User/usersSlice'
import { AccountModel, PostModel } from '@/shared/models'
import { isDarkMode } from '@/utils'
import { useMemo } from 'react'
import { IoHeartDislikeOutline, IoPersonAddOutline } from 'react-icons/io5'
import { MdBlock, MdOutlineReport } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

type MoreOptionsButtonContentProps = {
  username: AccountModel['username']
  postId?: PostModel['id']
  follower: AccountModel
  isForComment?: boolean
  closePopover: () => void
}

export const MoreOptionsButtonContent = ({
  username,
  follower,
  closePopover,
  isForComment = false,
  postId
}: MoreOptionsButtonContentProps) => {
  const dispatch = useDispatch()

  const isFollowed = useMemo(
    () => follower.followings.some((followingUsername) => followingUsername === username),
    [follower, username]
  )

  const handleFollowUser = () => {
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
    }
    closePopover()
  }

  const handleNotInterested = () => {
    dispatch(deletePost({ id: postId }))
    closePopover()
  }

  const handleBlockUser = () => {
    dispatch(blockUser({ username }))
    closePopover()
    toast.warn(`You blockes user @${username}`, {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: isDarkMode() ? 'dark' : 'light'
    })
  }

  const handleReportUser = () => {
    closePopover()
    toast.error(`This ${isForComment ? 'comment' : 'post'} is reported`, {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: isDarkMode() ? 'dark' : 'light'
    })
  }

  return (
    <div className="flex flex-col text-md font-bold justify-center text-center">
      <button onClick={handleFollowUser} className="option-button px-2 py-2">
        <IoPersonAddOutline />
        {isFollowed ? 'unfollow' : 'follow'}
      </button>
      {!isForComment && (
        <button onClick={handleNotInterested} className="option-button px-2 py-2">
          <IoHeartDislikeOutline /> Not Interested
        </button>
      )}
      <button onClick={handleBlockUser} className="option-button px-2 py-2">
        <MdBlock />
        Block @{username}
      </button>
      <button onClick={handleReportUser} className="option-button border-none px-2 py-2">
        <MdOutlineReport />
        Report {isForComment ? 'Comment' : 'Post'}
      </button>
    </div>
  )
}
