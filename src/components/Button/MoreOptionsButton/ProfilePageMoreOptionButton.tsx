import { ToastContainer } from "@/components/Shared/ToastContainer"
import { useToastContainer } from "@/hooks/useToastContainer"
import { AccountModel } from "@/shared/models"
import { Popover } from "flowbite-react"
import { TfiMore } from "react-icons/tfi"
import { MoreOptionsButtonContent } from "./MoreOptionsButtonContent"

type ProfilePageMoreOptionButtonProps = {
  open: boolean
  myAccount: AccountModel
  userUsername: AccountModel["username"]
  handleClose: () => void
  handleOpen: () => void
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const ProfilePageMoreOptionButton = ({
  handleClose,
  myAccount,
  open,
  userUsername,
  handleOpen,
  setIsOpen
}: ProfilePageMoreOptionButtonProps) => {
  const { handleShowToast, showToast, toastContent, toastType } = useToastContainer()
  return (
    <>
      <Popover
        trigger="click"
        aria-labelledby="more-options"
        content={
          <MoreOptionsButtonContent
            handleShowToast={handleShowToast}
            myAccount={myAccount!}
            isForUserPage={true}
            closePopover={handleClose}
            userUsername={userUsername}
          />
        }
        open={open}
        onOpenChange={setIsOpen}
      >
        <button onClick={handleOpen} className="action-button">
          <TfiMore className="w-6 h-6" />
        </button>
      </Popover>
      <ToastContainer toastType={toastType} showToast={showToast} toastContent={toastContent} />
    </>
  )
}
