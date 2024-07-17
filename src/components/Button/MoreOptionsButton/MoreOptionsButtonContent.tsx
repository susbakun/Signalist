import { removePostFromInterests } from "@/features/Post/postsSlice"
import { blockUser, followUser, unfollowUser } from "@/features/User/usersSlice"
import { AccountModel, PostModel, SignalModel } from "@/shared/models"
import { useMemo } from "react"
import { IoHeartDislikeOutline, IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5"
import { MdBlock, MdOutlineReport } from "react-icons/md"
import { useDispatch } from "react-redux"

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
  const dispatch = useDispatch()

  const isFollowed = useMemo(
    () => myAccount.followings.some((following) => following.username === userUsername),
    [myAccount, userUsername]
  )

  const handleFollowUser = () => {
    if (!isFollowed) {
      handleShowToast(`You followed user @${userUsername}`, "follow")
      dispatch(
        followUser({ followerUsername: myAccount.username, followingUsername: userUsername })
      )
    } else {
      handleShowToast(`You unfollowed user @${userUsername}`, "unfollow")
      dispatch(
        unfollowUser({ followerUsername: myAccount.username, followingUsername: userUsername })
      )
    }
    closePopover()
  }

  const handleNotInterested = () => {
    dispatch(removePostFromInterests({ id: postId }))
    closePopover()
  }

  const handleBlockUser = () => {
    closePopover()
    handleShowToast(`You blockes user @${userUsername}`, "block")
    setTimeout(() => {
      dispatch(blockUser({ blockerUsername: myAccount.username, blockedUsername: userUsername }))
    }, 3000)
  }

  const handleReportUser = () => {
    closePopover()
    handleShowToast(
      `The ${isForComment ? "Comment" : signalId ? "Signal" : "Post"} is reported`,
      "report"
    )
  }

  return (
    <div className="flex flex-col text-md font-bold justify-center text-center">
      {!isForUserPage && (
        <button onClick={handleFollowUser} className="option-button px-2 py-2">
          {isFollowed ? <IoPersonRemoveOutline /> : <IoPersonAddOutline />}
          {isFollowed ? "unfollow" : "follow"}
        </button>
      )}
      {!isForComment && !signalId && !isForUserPage && (
        <button onClick={handleNotInterested} className="option-button px-2 py-2">
          <IoHeartDislikeOutline /> Not Interested
        </button>
      )}
      <button onClick={handleBlockUser} className="option-button px-2 py-2">
        <MdBlock />
        Block @{userUsername}
      </button>
      <button onClick={handleReportUser} className="option-button border-none px-2 py-2">
        <MdOutlineReport />
        Report{" "}
        {isForComment ? "Comment" : signalId ? "Signal" : isForUserPage ? userUsername : "Post"}
      </button>
    </div>
  )
}
