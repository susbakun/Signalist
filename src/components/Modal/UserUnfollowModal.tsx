import { AccountModel } from '@/shared/models'
import { Button, Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

type UserUnfollowModalProps = {
  openModal: boolean
  handleCloseModal: () => void
  username: AccountModel['username']
  handleAcceptUnfollowModal: () => void
}

export const UserUnfollowModal = ({
  openModal,
  username,
  handleCloseModal,
  handleAcceptUnfollowModal
}: UserUnfollowModalProps) => {
  return (
    <Modal show={openModal} size="md" onClose={handleCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to unfollow this @{username}?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleAcceptUnfollowModal}>
              {"Yes, I'm sure"}
            </Button>
            <Button color="gray" onClick={handleCloseModal}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
