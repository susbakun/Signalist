import { Popover } from "flowbite-react"
import { IoBookmarkOutline, IoSettingsOutline } from "react-icons/io5"
import { TfiMore } from "react-icons/tfi"
import { Link } from "react-router-dom"

type ProfileOptionsButtonProps = {
  open: boolean
  handleOpen: () => void
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const UserOptionsButton = ({ open, handleOpen, setIsOpen }: ProfileOptionsButtonProps) => {
  return (
    <Popover
      trigger="click"
      aria-labelledby="more-options"
      content={
        <div className="flex flex-col text-md font-bold justify-center text-center">
          <Link to="settings" className="option-button px-2 py-2">
            <IoSettingsOutline />
            settings
          </Link>
          <Link to="bookmarks" className="option-button px-2 py-2">
            <IoBookmarkOutline />
            bookmarks
          </Link>
        </div>
      }
      open={open}
      onOpenChange={setIsOpen}
    >
      <button
        onClick={handleOpen}
        className="action-button
          absolute top-2 right-0"
      >
        <TfiMore className="w-6 h-6" />
      </button>
    </Popover>
  )
}
