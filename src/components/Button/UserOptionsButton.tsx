import { logout } from "@/utils/session"
import { Popover } from "flowbite-react"
import { FiLogOut } from "react-icons/fi"
import { IoBookmarkOutline, IoSettingsOutline } from "react-icons/io5"
import { TfiMore } from "react-icons/tfi"
import { Link, useNavigate } from "react-router-dom"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { TbUserOff } from "react-icons/tb"

type ProfileOptionsButtonProps = {
  open: boolean
  handleOpen: () => void
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const UserOptionsButton = ({ open, handleOpen, setIsOpen }: ProfileOptionsButtonProps) => {
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()

  const handleLogout = async () => {
    setIsOpen(false)
    setTimeout(async () => {
      await logout()
      navigate("/login")
    }, 1000)
  }

  const handleBlockedUsersClick = () => {
    setIsOpen(false)
    if (currentUser) {
      navigate(`/${currentUser.username}/blocked-accounts`)
    }
  }

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
          <button onClick={handleBlockedUsersClick} className="option-button px-2 py-2">
            <TbUserOff />
            Blocked Users
          </button>
          <button
            onClick={handleLogout}
            className="option-button border-none px-2 py-2 text-red-600 hover:text-red-700"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      }
      open={open}
      onOpenChange={setIsOpen}
    >
      <button
        onClick={handleOpen}
        className="action-button
          absolute top-8 right-8"
      >
        <TfiMore className="w-6 h-6" />
      </button>
    </Popover>
  )
}
