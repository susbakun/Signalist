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
}

export const MessageRoomTopBar = ({ myMessages }: MessageRoomTopBarProps) => {
  const { getProperAvatar } = useUserMessageRoom()
  const [enlarged, setEnlarged] = useState(false)

  const { isGroup } = myMessages

  let placeholder

  const handleImageEnlarge = () => {
    if (
      (myMessages.isGroup && myMessages.groupInfo.groupImageUrl) ||
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
        className="bg-gray-200/80 dark:bg-gray-800 py-2 px-6 sticky top-0 w-full
        flex justify-between items-center"
      >
        <div className="flex items-center">
          <div className="cursor-pointer" onClick={handleImageEnlarge}>
            {isGroup
              ? getProperAvatar(placeholder, undefined, myMessages.groupInfo)
              : getProperAvatar(placeholder, myMessages.userInfo, undefined)}
          </div>
          <h2 className="text-2xl font-bold">
            {isGroup ? myMessages.groupInfo.groupName : myMessages.userInfo.name}
          </h2>
        </div>
        <div className="flex items-center gap-10">
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
              <button className="action-button">
                <GoInfo className="w-7 h-7" />
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
      {enlarged &&
        ((!isGroup && myMessages.userInfo.imageUrl) ||
          (isGroup && myMessages.groupInfo.groupImageUrl)) && (
          <div
            className="fixed inset-0 z-50 h-screen flex items-center
            justify-center bg-black bg-opacity-75"
            onClick={handleCloseEnlargedImageView}
          >
            <img
              className="w-[70%] h-[70%] object-contain"
              src={isGroup ? myMessages.groupInfo.groupImageUrl : myMessages.userInfo.imageUrl}
              alt="Enlarged Message"
            />
          </div>
        )}
    </>
  )
}