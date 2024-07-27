import {
  MoreOptionsButtonContent,
  MoreOptionsButtonForCommentContent,
  ToastContainer
} from "@/components"
import { useAppSelector } from "@/features/Post/postsSlice"
import { useToastContainer } from "@/hooks/useToastContainer"
import { AccountModel, CommentModel, PostModel, SignalModel } from "@/shared/models"
import { Popover } from "flowbite-react"
import { useState } from "react"
import { MdOutlineModeEditOutline } from "react-icons/md"
import { TfiMore } from "react-icons/tfi"

type MoreOptionsButtonProps = {
  postId?: PostModel["id"]
  signalId?: SignalModel["id"]
  commentId?: CommentModel["commentId"]
  isForComment?: boolean
  username: AccountModel["username"]
  handleOpenEditPostModal?: () => void
  handleDeleteComment?: () => void
}

export const MoreOptionsButton = ({
  postId,
  signalId,
  isForComment = false,
  username,
  handleOpenEditPostModal,
  handleDeleteComment
}: MoreOptionsButtonProps) => {
  const [open, setIsOpen] = useState(false)

  const { handleShowToast, showToast, toastContent, toastType } = useToastContainer()
  const users = useAppSelector((state) => state.users)
  const myAccount = users.find((user) => user.username === "Amir_Aryan")

  const handleCloseCreatePostModal = () => {
    setIsOpen(false)
  }

  if (isForComment && handleDeleteComment && myAccount?.username === username)
    return (
      <Popover
        trigger="click"
        aria-labelledby="more-options"
        content={<MoreOptionsButtonForCommentContent handleDeleteComment={handleDeleteComment} />}
        open={open}
        onOpenChange={setIsOpen}
      >
        <button className="action-button">
          <TfiMore className="w-6 h-6" />
        </button>
      </Popover>
    )
  else if (myAccount?.username === username && !signalId)
    return (
      <button onClick={handleOpenEditPostModal} className="action-button">
        <MdOutlineModeEditOutline className="w-6 h-6" />
      </button>
    )
  else if (myAccount?.username !== username && (signalId || postId || isForComment))
    return (
      <>
        <Popover
          trigger="click"
          aria-labelledby="more-options"
          content={
            <MoreOptionsButtonContent
              myAccount={myAccount!}
              isForComment={isForComment}
              postId={postId}
              signalId={signalId}
              closePopover={handleCloseCreatePostModal}
              userUsername={username}
              handleShowToast={handleShowToast}
            />
          }
          open={open}
          onOpenChange={setIsOpen}
        >
          <button className="action-button">
            <TfiMore className="w-6 h-6" />
          </button>
        </Popover>
        <ToastContainer toastType={toastType} showToast={showToast} toastContent={toastContent} />
      </>
    )
}
