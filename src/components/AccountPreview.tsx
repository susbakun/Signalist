import { Avatar } from 'flowbite-react'
import { Link } from 'react-router-dom'

export const AccountPreview = () => {
  return (
    <div className="flex flex-col justify-center space-y-4 mb-4">
      <Avatar placeholderInitials="AA" size="lg" rounded />
      <div
        className="space-y-1 font-medium dark:text-white                            
      text-slate-700 flex flex-col justify-center text-center"
      >
        <div>AmirSaeed AryanMehr</div>
        <div className="detail-text">@Amir Aryan</div>
        <div
          className="text-sm text-gray-500 dark:text-gray-400
          flex gap-4 justify-center"
        >
          <p>
            <span className="text-slate-700 dark:text-white">20</span> score
          </p>
          <p>
            <span className="text-slate-700 dark:text-white">10k</span>{' '}
            <Link
              className="hover:text-primary-link-button transition
              ease-out dark:hover:text-dark-link-button"
              to="/"
            >
              followers
            </Link>
          </p>
          <p>
            <span className="text-slate-700 dark:text-white">2k</span>{' '}
            <Link
              className="hover:text-primary-link-button transition
              ease-out dark:hover:text-dark-link-button"
              to="/"
            >
              Following
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
