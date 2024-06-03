import { cn, isDarkMode } from '@/utils'
import { Popover } from 'flowbite-react'
import { FaRegBell } from 'react-icons/fa'
import Toggle from 'react-toggle'

export const UserNotificationsButton = () => {
  return (
    <Popover
      aria-labelledby="notifications"
      content={
        <div className="flex flex-col gap-2 px-2 py-3 items-center">
          <label className={cn('flex items-center gap-2', { dark: isDarkMode() })}>
            <span className="w-8 mr-5">signals</span>
            <Toggle defaultChecked={false} icons={false} />
          </label>
          <label className={cn('flex items-center gap-2', { dark: isDarkMode() })}>
            <span className="w-8 mr-5">streams</span>
            <Toggle defaultChecked={false} icons={false} />
          </label>
          <label className={cn('flex items-center gap-2', { dark: isDarkMode() })}>
            <span className="w-8 mr-5">posts</span>
            <Toggle defaultChecked={false} icons={false} />
          </label>
        </div>
      }
    >
      <button className="bg-transparent action-button">
        <FaRegBell className="w-6 h-6" />
      </button>
    </Popover>
  )
}
