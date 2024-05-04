import { AccountModel, PostModel } from '@/shared/models'
import { Popover } from 'flowbite-react'
import { useRef, useState } from 'react'
import { TfiMore } from 'react-icons/tfi'
import { MoreOptionsButtonContent } from './MoreOptionsButtonContent'

type MoreOptionsButtonProps = {
  postId: PostModel['id']
  username: AccountModel['username']
}

export const MoreOptionsButton = ({ username, postId }: MoreOptionsButtonProps) => {
  const [open, setIsOpen] = useState(false)
  const popOverRef = useRef<HTMLDivElement>(null)
  const handleClose = () => {
    setIsOpen(false)
  }
  const handleOpen = () => {
    setIsOpen(true)
  }
  return (
    <Popover
      ref={popOverRef}
      trigger="click"
      aria-labelledby="more-options"
      content={
        <MoreOptionsButtonContent postId={postId} closePopover={handleClose} username={username} />
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
