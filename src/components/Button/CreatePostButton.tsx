import Tippy from '@tippyjs/react'
import { GoPlusCircle } from 'react-icons/go'
import { roundArrow } from 'tippy.js'
import 'tippy.js/dist/svg-arrow.css'

export const CreatePostButton = () => {
  return (
    <Tippy
      content="create post"
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
        className="main-button transition-all duration-100 ease-out fixed
        right-4 bottom-4 px-4 py-4 rounded-full"
      >
        <GoPlusCircle className="w-6 h-6" />
      </button>
    </Tippy>
  )
}
