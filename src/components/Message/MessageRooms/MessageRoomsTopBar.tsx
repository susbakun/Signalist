import Tippy from "@tippyjs/react"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { TbMessagePlus } from "react-icons/tb"
import { roundArrow } from "tippy.js"

type MessageRoomsTopBarProps = {
  handleOpenCreateMessageModal: () => void
  handleOpenCreateGroupModal: () => void
}

export const MessageRoomsTopBar = ({
  handleOpenCreateMessageModal,
  handleOpenCreateGroupModal
}: MessageRoomsTopBarProps) => {
  return (
    <div className="flex justify-between mb-6 items-center">
      <h2 className="text-2xl font-bold">Chats</h2>
      <div className="flex gap-6 items-center">
        <Tippy
          content="New Group"
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
          <button onClick={handleOpenCreateGroupModal} className="action-button">
            <AiOutlineUsergroupAdd className="w-7 h-7" />
          </button>
        </Tippy>
        <Tippy
          content="New message"
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
          <button onClick={handleOpenCreateMessageModal} className="action-button">
            <TbMessagePlus className="w-7 h-7" />
          </button>
        </Tippy>
      </div>
    </div>
  )
}
