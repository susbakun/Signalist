import Tippy from '@tippyjs/react'
import { HiMiniSignal } from 'react-icons/hi2'
import { roundArrow } from 'tippy.js'

type CreateSignalButtonProps = {
  handleOpenModal: () => void
}

export const CreateSignalButton = ({ handleOpenModal }: CreateSignalButtonProps) => {
  return (
    <Tippy
      content="create signal"
      className="dark:bg-gray-700 bg-gray-900 text-white font-sans
      rounded-md px-1 py-[1px] text-sm"
      delay={[1000, 0]}
      placement="top"
      animation="fade"
      arrow={roundArrow}
      duration={10}
      hideOnClick={true}
    >
      <button
        onClick={handleOpenModal}
        className="main-button transition-all duration-100 ease-out fixed
        right-4 bottom-4 px-4 py-4 rounded-full"
      >
        <HiMiniSignal className="w-6 h-6" />
      </button>
    </Tippy>
  )
}
