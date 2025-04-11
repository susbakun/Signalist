import { removePostAsync } from "@/features/Post/postsSlice"
import {
  blockUserAsync,
  followUserAsync,
  unfollowUserAsync,
  useAppSelector
} from "@/features/User/usersSlice"
import { AccountModel, PostModel, SignalModel } from "@/shared/models"
import { logout } from "@/utils/session"
import { useMemo, useState } from "react"
import { FiLogOut } from "react-icons/fi"
import { IoHeartDislikeOutline, IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5"
import { MdBlock, MdOutlineReport } from "react-icons/md"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store"
import { useNavigate } from "react-router-dom"

type MoreOptionsButtonContentProps = {
  userUsername: AccountModel["username"]
  postId?: PostModel["id"]
  signalId?: SignalModel["id"]
  myAccount: AccountModel
  isForComment?: boolean
  isForUserPage?: boolean
  handleShowToast: (content: string, type: string) => void
  closePopover: () => void
}

export const MoreOptionsButtonContent = ({
  userUsername,
  postId,
  signalId,
  myAccount,
  isForComment = false,
  isForUserPage,
  handleShowToast,
  closePopover
}: MoreOptionsButtonContentProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isActionLoading, setIsActionLoading] = useState(false)
  const navigate = useNavigate()

  // Get user loading state from the store
  const { loading: isUsersLoading } = useAppSelector((state) => state.users)

  // Calculate if the button is in loading state
  const isLoading = isActionLoading || isUsersLoading

  const isFollowed = useMemo(
    () => myAccount.followings.some((following) => following.username === userUsername),
    [myAccount, userUsername]
  )

  const handleFollowUser = async () => {
    setIsActionLoading(true)
    try {
      if (!isFollowed) {
        await dispatch(
          followUserAsync({ followerUsername: myAccount.username, followingUsername: userUsername })
        ).unwrap()
        handleShowToast(`You followed user @${userUsername}`, "follow")
      } else {
        await dispatch(
          unfollowUserAsync({
            followerUsername: myAccount.username,
            followingUsername: userUsername
          })
        ).unwrap()
        handleShowToast(`You unfollowed user @${userUsername}`, "unfollow")
      }
    } catch (error) {
      handleShowToast(`Failed to ${isFollowed ? "unfollow" : "follow"} user`, "error")
    } finally {
      setIsActionLoading(false)
      closePopover()
    }
  }

  const handleNotInterested = async () => {
    if (!postId) return
    setIsActionLoading(true)
    try {
      await dispatch(removePostAsync(postId)).unwrap()
      handleShowToast("Post removed from your feed", "success")
    } catch (error) {
      handleShowToast("Failed to remove post", "error")
    } finally {
      setIsActionLoading(false)
      closePopover()
    }
  }

  const handleBlockUser = async () => {
    setIsActionLoading(true)
    try {
      await dispatch(
        blockUserAsync({ blockerUsername: myAccount.username, blockedUsername: userUsername })
      ).unwrap()
      handleShowToast(`You blocked user @${userUsername}`, "block")
      handleShowToast(
        `User @${userUsername} has been removed from your followers and followings`,
        "info"
      )
    } catch (error) {
      handleShowToast("Failed to block user", "error")
    } finally {
      setIsActionLoading(false)
      closePopover()
    }
  }

  const handleReportUser = () => {
    closePopover()
    handleShowToast(
      `The ${isForComment ? "Comment" : signalId ? "Signal" : "Post"} is reported`,
      "report"
    )
  }

  const handleLogout = () => {
    closePopover()
    handleShowToast("Logging out...", "logout")
    setTimeout(() => {
      logout()
      navigate("/login")
    }, 1000)
  }

  const isOwnProfile = isForUserPage && userUsername === myAccount.username

  return (
    <div className="flex flex-col text-md font-bold justify-center text-center">
      {!isForUserPage && (
        <button
          onClick={handleFollowUser}
          disabled={isLoading}
          className={`option-button px-2 py-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              {isFollowed ? <IoPersonRemoveOutline /> : <IoPersonAddOutline />}
              {isFollowed ? "unfollow" : "follow"}
            </>
          )}
        </button>
      )}
      {!isForComment && !signalId && !isForUserPage && (
        <button
          onClick={handleNotInterested}
          disabled={isLoading}
          className={`option-button px-2 py-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              <IoHeartDislikeOutline /> Not Interested
            </>
          )}
        </button>
      )}
      {!isOwnProfile && (
        <>
          <button
            onClick={handleBlockUser}
            disabled={isLoading}
            className={`option-button px-2 py-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <MdBlock />
                Block @{userUsername}
              </>
            )}
          </button>
          <button
            onClick={handleReportUser}
            disabled={isLoading}
            className={`option-button border-none px-2 py-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <MdOutlineReport />
            Report{" "}
            {isForComment ? "Comment" : signalId ? "Signal" : isForUserPage ? userUsername : "Post"}
          </button>
        </>
      )}
      {isOwnProfile && (
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={`option-button border-none px-2 py-2 text-red-600 hover:text-red-700 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <FiLogOut />
          Logout
        </button>
      )}
    </div>
  )
}
