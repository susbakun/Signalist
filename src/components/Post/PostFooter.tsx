import { AppDispatch } from "@/app/store"
import { PostCommentModal, SharePostModal, ToastContainer } from "@/components"
import { dislikePostAsync, likePostAsync } from "@/features/Post/postsSlice"
import { updateBookmarksAsync } from "@/features/User/usersSlice"
import { useToastContainer } from "@/hooks/useToastContainer"
import { AccountModel, PostModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"
import { cn, getCurrentUsername } from "@/utils"
import millify from "millify"
import { useEffect, useState } from "react"
import { FaBookmark, FaCommentSlash, FaRegBookmark, FaRegComment } from "react-icons/fa"
import { HiOutlineLightningBolt } from "react-icons/hi"
import { HiBolt } from "react-icons/hi2"
import { useDispatch } from "react-redux"

type PostFooterProps = {
  post: Omit<PostModel, "comments">
  comments?: PostModel["comments"]
  simplified?: boolean
  amISubscribed?: boolean
  handleOpenEditPostModal?: () => void
  myAccount: AccountModel
}

export const PostFooter = ({
  post,
  comments,
  simplified,
  amISubscribed,
  handleOpenEditPostModal,
  myAccount
}: PostFooterProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const currentUsername = getCurrentUsername()

  const isLiked = post.likes.some((user) => user.username === currentUsername)

  const [openShareModal, setOpenShareModal] = useState(false)
  const [openCommentsModal, setOpenCommentsModal] = useState(false)
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)

  const { handleShowToast, showToast, toastContent, toastType } = useToastContainer()
  const dispatch = useDispatch<AppDispatch>()

  const { user: publisher } = post

  const handleLikePost = async () => {
    if (isLikeLoading) return

    setIsLikeLoading(true)

    const user: SimplifiedAccountType = {
      name: myAccount.name,
      username: myAccount.username,
      imageUrl: myAccount.imageUrl
    }

    try {
      if (!isLiked) {
        await dispatch(likePostAsync({ postId: post.id, user }))
      } else {
        await dispatch(dislikePostAsync({ postId: post.id, user }))
      }
    } catch (error) {
      console.error("Failed to update like status:", error)
      handleShowToast("Failed to update like status", "error")
    } finally {
      setIsLikeLoading(false)
    }
  }

  const handleBookmarkPost = async () => {
    if (!myAccount || isBookmarkLoading) return

    // Ensure bookmarks structure exists
    if (!myAccount.bookmarks || !myAccount.bookmarks.posts) {
      console.error("Bookmarks structure not found in user account")
      handleShowToast("Bookmarks not available", "error")
      return
    }

    // Optimistically update UI
    setIsBookmarkLoading(true)
    const wasBookmarked = isBookmarked
    setIsBookmarked(!wasBookmarked)

    try {
      const updatedBookmarks = { ...myAccount.bookmarks }

      if (!wasBookmarked) {
        // Add post ID to bookmarks
        updatedBookmarks.posts = [...updatedBookmarks.posts, post.id]
      } else {
        // Remove post ID from bookmarks
        updatedBookmarks.posts = updatedBookmarks.posts.filter((id) => id !== post.id)
      }

      await dispatch(
        updateBookmarksAsync({
          username: myAccount.username,
          bookmarks: updatedBookmarks
        })
      ).unwrap()
    } catch (error) {
      // Revert optimistic update on error
      setIsBookmarked(wasBookmarked)
      console.error("Failed to update bookmark status:", error)
      handleShowToast("Failed to bookmark post", "error")
    } finally {
      setIsBookmarkLoading(false)
    }
  }

  const handleCloseShareModal = () => {
    setOpenShareModal(false)
  }

  const handleOpenShareModal = () => {
    setOpenShareModal(true)
  }

  const handleOpenCommentsModal = () => {
    setOpenCommentsModal(true)
  }

  const handleCloseCommentsModal = () => {
    setOpenCommentsModal(false)
  }

  const handleShareEmail = () => {
    const title = `See this post by @${publisher.username}`
    const body = `See this post by @${publisher.username}:https://www.signalists/explore/${post.id}`
    const shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    handleCloseShareModal()
    window.open(shareUrl)
  }

  const handleCopyLink = async () => {
    const link = `https://www.signalists/explore/${post.id}`
    await navigator.clipboard.writeText(link)
    handleShowToast("Post link is copied", "copy_link")
    handleCloseShareModal()
  }

  useEffect(() => {
    if (myAccount && myAccount.bookmarks && myAccount.bookmarks.posts) {
      const isPostBookmarked = myAccount.bookmarks.posts.includes(post.id)
      setIsBookmarked(isPostBookmarked)
    }
  }, [myAccount, post.id])

  return (
    <>
      <div
        className={cn("flex justify-between items-center mt-2", { "-translate-x-2": simplified })}
      >
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-[2px]">
            <button
              onClick={handleLikePost}
              className="action-button disabled:opacity-20"
              disabled={isLikeLoading}
            >
              {isLiked ? (
                <HiBolt className="w-6 h-6 text-yellow-300" />
              ) : (
                <HiOutlineLightningBolt className="w-6 h-6" />
              )}
            </button>
            <span className="detail-text">{millify(post.likes.length)}</span>
          </div>
          {comments && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleOpenCommentsModal}
                className="action-button"
                disabled={!amISubscribed && post.isPremium}
              >
                {post.isPremium && !amISubscribed ? (
                  <FaCommentSlash className="w-5 h-5" />
                ) : (
                  <FaRegComment className="w-5 h-5" />
                )}
              </button>
              <span className="detail-text">{millify(comments.length)}</span>
            </div>
          )}
          {!simplified && (
            <>
              <button className="action-button">repost</button>
              <button onClick={handleOpenShareModal} className="action-button">
                Share
              </button>
            </>
          )}
        </div>
        <button onClick={handleBookmarkPost} className="action-button" disabled={isBookmarkLoading}>
          {isBookmarked ? (
            <FaBookmark className="w-5 h-5" />
          ) : (
            <FaRegBookmark className="w-5 h-5" />
          )}
        </button>
      </div>
      <SharePostModal
        openModal={openShareModal}
        handleCloseModal={handleCloseShareModal}
        copyLink={handleCopyLink}
        shareEmail={handleShareEmail}
      />
      {comments && (
        <PostCommentModal
          handleOpenEditPostModal={handleOpenEditPostModal}
          post={post}
          comments={comments}
          handleCloseCommentsModal={handleCloseCommentsModal}
          openModal={openCommentsModal}
        />
      )}
      <ToastContainer toastType={toastType} showToast={showToast} toastContent={toastContent} />
    </>
  )
}
