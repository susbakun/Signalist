import { ChatType } from "@/shared/types"
import Tippy from "@tippyjs/react"
import { BsCameraVideo } from "react-icons/bs"
import { IoCallOutline } from "react-icons/io5"
import { roundArrow } from "tippy.js"

type MessageRoomTopBarProps = {
  userName: ChatType["sender"]["username"]
}

export const MessageRoomTopBar = ({ userName }: MessageRoomTopBarProps) => {
  return (
    <div
      className="bg-gray-200/80 dark:bg-gray-800 py-4 px-6 sticky top-0 w-full
        flex justify-between items-center"
    >
      <h2 className="text-2xl font-bold">{userName}</h2>
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
  )
}
