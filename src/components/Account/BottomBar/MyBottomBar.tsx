import Tippy from '@tippyjs/react'
import { IoPersonAddOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { roundArrow } from 'tippy.js'

export const MyBottomBar = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-5">
        <div>
          <button
            className="px-2 py-1 bg-primary-link-button
            dark:bg-dark-link-button rounded-md action-button
            text-black/90 dark:text-white"
          >
            Edit Profile
          </button>
        </div>
        <div>
          <Link
            to="/premium"
            className="px-2 py-1 bg-gradient-to-r
              dark:from-dark-link-button from-primary-link-button to-[#ff00e5]
              dark:to-[#ff00e5] rounded-md action-button
            text-white inline-block"
          >
            Manage Premium
          </Link>
        </div>
      </div>
      <div>
        <Tippy
          content="invite someone"
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
            className="px-2 py-1 bg-primary-link-button
            dark:bg-dark-link-button rounded-md action-button
            text-black/90 dark:text-white"
          >
            <IoPersonAddOutline className="w-5 h-5" />
          </button>
        </Tippy>
      </div>
    </div>
  )
}
