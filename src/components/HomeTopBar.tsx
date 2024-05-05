import { Popover } from 'flowbite-react'
import { FaRegBell } from 'react-icons/fa'

export const HomeTopBar = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <Popover
        aria-labelledby="notifications"
        content={
          <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
            <div
              className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600
            dark:bg-gray-700"
            >
              <h3 id="default-popover" className="font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
            </div>
            <div className="px-3 py-2">
              <p>The message box is empty.</p>
            </div>
          </div>
        }
      >
        <button className="bg-transparent action-button">
          <FaRegBell className="w-6 h-6" />
        </button>
      </Popover>
    </div>
  )
}
