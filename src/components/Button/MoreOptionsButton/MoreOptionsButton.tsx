import { MoreOptionsButtonContent } from '@/components'
import { useAppSelector } from '@/features/Post/postsSlice'
import { AccountModel, PostModel, SignalModel } from '@/shared/models'
import { Popover } from 'flowbite-react'
import { useState } from 'react'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { TfiMore } from 'react-icons/tfi'

type MoreOptionsButtonProps = {
  postId?: PostModel['id']
  signalId?: SignalModel['id']
  isForComment?: boolean
  username: AccountModel['username']
}

type OutletContextType = {
  handleOpenEditModal: () => void
}

export const MoreOptionsButton = ({
  postId,
  username,
  signalId,
  isForComment = false
}: MoreOptionsButtonProps) => {
  const [open, setIsOpen] = useState(false)

  // const { handleOpenEditModal } = useOutletContext<OutletContextType>()

  const users = useAppSelector((state) => state.users)
  const me = users.find((user) => user.username === 'Amir_Aryan')

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  if (me?.username === username && !signalId)
    return (
      <>
        <button onClick={handleOpenEditModal} className="action-button">
          <MdOutlineModeEditOutline className="w-6 h-6" />
        </button>
      </>
    )
  else if (me?.username !== username && (signalId || postId))
    return (
      <Popover
        trigger="click"
        aria-labelledby="more-options"
        content={
          <MoreOptionsButtonContent
            follower={me!}
            isForComment={isForComment}
            postId={postId}
            signalId={signalId}
            closePopover={handleClose}
            username={username}
          />
        }
        open={open}
        onOpenChange={setIsOpen}
      >
        <button onClick={handleOpen} className="action-button">
          <TfiMore className="w-6 h-6" />
        </button>
      </Popover>
    )
}
