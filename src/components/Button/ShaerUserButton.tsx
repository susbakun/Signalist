import Tippy from '@tippyjs/react'
import { IoShareOutline } from 'react-icons/io5'
import { roundArrow } from 'tippy.js'

export const ShaerUserButton = () => {
  return (
    <div>
      <Tippy
        content="share user"
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
          className="action-button
                text-black/90 dark:text-white"
        >
          <IoShareOutline className="w-6 h-6" />
        </button>
      </Tippy>
    </div>
  )
}
