import { useUserMessageRoom } from "@/hooks/useUserMessageRoom"
import { MessageModel } from "@/shared/models"
import { getAvatarPlaceholder } from "@/utils"
import Tippy from "@tippyjs/react"
import { useState } from "react"
import { BsCameraVideo } from "react-icons/bs"
import { IoCallOutline } from "react-icons/io5"
import { roundArrow } from "tippy.js"

type MessageRoomTopBarProps = {
  userInfo: MessageModel["username"]["roomId"]["userInfo"]
}

export const MessageRoomTopBar = ({ userInfo }: MessageRoomTopBarProps) => {
  const { getDesiredUserAvatar } = useUserMessageRoom()
  const placeholder = getAvatarPlaceholder(userInfo.name)
  const [enlarged, setEnlarged] = useState(false)

  const handleImageEnlarge = () => {
    setEnlarged(true)
  }

  const handleCloseEnlargedImageView = () => {
    setEnlarged(false)
  }

  return (
    <>
      <div
        className="bg-gray-200/80 dark:bg-gray-800 py-2 px-6 sticky top-0 w-full
        flex justify-between items-center"
      >
        <div className="flex items-center">
          <div className="cursor-pointer" onClick={handleImageEnlarge}>
            {getDesiredUserAvatar(userInfo, placeholder)}
          </div>
          <h2 className="text-2xl font-bold">{userInfo.username}</h2>
        </div>
        <div className="flex items-center gap-10">
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
              <IoCallOutline className="w-7 h-7" />
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
              <BsCameraVideo className="w-7 h-7" />
            </button>
          </Tippy>
        </div>
      </div>
      {enlarged && userInfo.imageUrl && (
        <div
          className="fixed inset-0 z-50 h-screen flex items-center
          justify-center bg-black bg-opacity-75"
          onClick={handleCloseEnlargedImageView}
        >
          <img
            className="w-[70%] h-[70%] object-contain"
            src={userInfo.imageUrl}
            alt="Enlarged Message"
          />
        </div>
      )}
    </>
  )
}
