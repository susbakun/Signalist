import { EditProfileModal } from "@/components/Modal/UserPage/EditProfileModal"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import Tippy from "@tippyjs/react"
import { useState } from "react"
import { IoPersonAddOutline } from "react-icons/io5"
import { Link } from "react-router-dom"
import { roundArrow } from "tippy.js"

export const MyBottomBar = () => {
  const [openEditModal, setOpenEditModal] = useState(false)
  const { currentUser: myAccount } = useCurrentUser()

  const handleOpenEditModal = () => {
    setOpenEditModal(true)
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false)
  }

  if (!myAccount) return null

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex gap-2 sm:gap-4 flex-wrap">
        <div>
          <button
            onClick={handleOpenEditModal}
            className="px-2 py-1 bg-primary-link-button dark:bg-dark-link-button rounded-md action-button text-white text-sm sm:text-base"
          >
            Edit Profile
          </button>
        </div>
        <div>
          <Link
            to="/premium"
            className="px-2 py-1 bg-gradient-to-r dark:from-dark-link-button from-primary-link-button to-[#ff00e5] dark:to-[#ff00e5] rounded-md action-button text-white inline-block text-sm sm:text-base"
          >
            Manage Premium
          </Link>
        </div>
      </div>
      <div>
        <Tippy
          content="invite someone"
          className="dark:bg-gray-700 bg-gray-900 text-white font-sans rounded-md px-1 py-[1px] text-sm"
          delay={[1000, 0]}
          placement="top"
          animation="fade"
          arrow={roundArrow}
          duration={10}
          hideOnClick={true}
        >
          <button className="px-2 py-1 bg-primary-link-button dark:bg-dark-link-button rounded-md action-button text-white">
            <IoPersonAddOutline className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </Tippy>
      </div>

      {/* Edit Profile Modal */}
      {openEditModal && (
        <EditProfileModal
          openModal={openEditModal}
          handleCloseModal={handleCloseEditModal}
          userAccount={myAccount}
        />
      )}
    </div>
  )
}
