import Tippy from "@tippyjs/react"
import { IoIosAddCircle } from "react-icons/io"
import { roundArrow } from "tippy.js"

export const UserStreamButton = () => {
  return (
    <Tippy
      content="stream"
      className="dark:bg-gray-700 bg-gray-900 text-white font-sans
      rounded-md px-1 py-[1px] text-sm"
      delay={[1000, 0]}
      placement="bottom"
      animation="fade"
      arrow={roundArrow}
      duration={10}
      hideOnClick={true}
    >
      <button className="absolute top-[75%] left-2">
        <IoIosAddCircle className="w-8 h-8" />
      </button>
    </Tippy>
  )
}
