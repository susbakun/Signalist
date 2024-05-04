import { Modal } from 'flowbite-react'
import { IoMailOutline } from 'react-icons/io5'
import { MdOutlineAttachment } from 'react-icons/md'

type SharePostModalProps = {
  openModal: boolean
  handleCloseModal: () => void
  shareEmail: () => void
  copyLink: () => Promise<void>
}

export const SharePostModal = ({
  openModal,
  handleCloseModal,
  shareEmail,
  copyLink
}: SharePostModalProps) => {
  return (
    <Modal size="sm" show={openModal} onClose={handleCloseModal}>
      <Modal.Header className="border-none pb-0">Share to...</Modal.Header>
      <Modal.Body className="flex flex-col px-0 pb-2 mx-0">
        <button
          onClick={shareEmail}
          className="flex gap-2 items-center option-button py-4 
          px-4 border-none rounded-md"
        >
          <IoMailOutline className="w-5 h-5" /> Share via Email
        </button>
        <button
          onClick={copyLink}
          className="flex gap-2 option-button border-none py-4 px-4 
          rounded-md"
        >
          <MdOutlineAttachment className="w-5 h-5" />
          Copy link
        </button>
      </Modal.Body>
    </Modal>
  )
}
