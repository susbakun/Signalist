import { GroupInfoModal } from "@/components/Modal/MessageRoom/GroupInfo/GroupInfoModal"
import { useUserMessageRoom } from "@/hooks/useUserMessageRoom"
import { MessageModel } from "@/shared/models"
import { getAvatarPlaceholder } from "@/utils"
import Tippy from "@tippyjs/react"
import { useState } from "react"
import { BsCameraVideo } from "react-icons/bs"
import { GoInfo } from "react-icons/go"
import { IoCallOutline } from "react-icons/io5"
import { roundArrow } from "tippy.js"

type MessageRoomTopBarProps = {
  myMessages: MessageModel["username"]["roomId"]
  onBack: () => void
}

export const MessageRoomTopBar = ({ myMessages, onBack }: MessageRoomTopBarProps) => {
  const { getProperAvatar } = useUserMessageRoom()
  const [enlarged, setEnlarged] = useState(false)
  const [openGroupInfoModal, setOpenGroupInfoModal] = useState(false)

  const { isGroup } = myMessages

  let placeholder

  const handleOpenGroupInfoModal = () => {
    setOpenGroupInfoModal(true)
  }

  const handleCloseGroupInfoModal = () => {
    setOpenGroupInfoModal(false)
  }

  const handleImageEnlarge = () => {
    if (
      (myMessages.isGroup && myMessages.groupInfo.groupImageHref) ||
      (!myMessages.isGroup && myMessages.userInfo.imageUrl)
    )
      setEnlarged(true)
  }

  const handleCloseEnlargedImageView = () => {
    setEnlarged(false)
  }

  if (isGroup) {
    placeholder = getAvatarPlaceholder(myMessages.groupInfo.groupName)
  } else {
    placeholder = getAvatarPlaceholder(myMessages.userInfo.name)
  }

  return (
    <>
      <div
        className="bg-gray-200/80 dark:bg-gray-800 py-1.5 sm:py-2 px-3 sm:px-6 sticky top-0 w-full
        flex justify-between items-center"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
          <button
            onClick={onBack}
            className="md:hidden text-gray-600 dark:text-gray-100 hover:text-gray-800 dark:hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="cursor-pointer" onClick={handleImageEnlarge}>
            {isGroup
              ? getProperAvatar(placeholder, undefined, myMessages.groupInfo)
              : getProperAvatar(placeholder, myMessages.userInfo, undefined)}
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
            {isGroup ? myMessages.groupInfo.groupName : myMessages.userInfo.name}
          </h2>
        </div>
        <div className="flex items-center gap-4 md:gap-10">
          {isGroup && (
            <Tippy
              content="group info"
              className="dark:bg-gray-900 bg-gray-900 text-white font-sans
              rounded-md px-1 py-[2px] text-sm"
              delay={[1000, 0]}
              placement="bottom-end"
              animation="fade"
              arrow={roundArrow}
              offset={[0, 8]}
              duration={10}
              hideOnClick={true}
            >
              <button onClick={handleOpenGroupInfoModal} className="action-button">
                <GoInfo className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </button>
            </Tippy>
          )}
          <Tippy
            content="Make a Voice Call"
            className="dark:bg-gray-900 bg-gray-900 text-white font-sans
            rounded-md px-1 py-[2px] text-sm"
            delay={[1000, 0]}
            placement="bottom"
            animation="fade"
            arrow={roundArrow}
            offset={[0, 8]}
            duration={10}
            hideOnClick={true}
          >
            <button className="action-button">
              <IoCallOutline className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </button>
          </Tippy>
          <Tippy
            content="Make a Video Call"
            className="dark:bg-gray-900 bg-gray-900 text-white font-sans
            rounded-md px-1 py-[2px] text-sm"
            delay={[1000, 0]}
            placement="bottom-end"
            animation="fade"
            arrow={roundArrow}
            offset={[0, 8]}
            duration={10}
            hideOnClick={true}
          >
            <button className="action-button">
              <BsCameraVideo className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </button>
          </Tippy>
        </div>
      </div>
      {enlarged &&
        ((!isGroup && myMessages.userInfo.imageUrl) ||
          (isGroup && myMessages.groupInfo.groupImageHref)) && (
          <div
            className="fixed inset-0 z-50 h-screen flex items-center
            justify-center bg-black bg-opacity-75"
            onClick={handleCloseEnlargedImageView}
          >
            <img
              className="w-[70%] h-[70%] object-contain"
              src={isGroup ? myMessages.groupInfo.groupImageHref : myMessages.userInfo.imageUrl}
              alt="Enlarged Message"
            />
          </div>
        )}
      <GroupInfoModal
        openModal={openGroupInfoModal}
        groupInfo={myMessages.groupInfo}
        members={myMessages.usersInfo}
        handleCloseModal={handleCloseGroupInfoModal}
      />
    </>
  )
}
