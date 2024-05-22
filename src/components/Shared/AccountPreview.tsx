import { useAppSelector } from '@/features/Post/postsSlice'
import { Avatar } from 'flowbite-react'
import millify from 'millify'
import { Link } from 'react-router-dom'

export const AccountPreview = () => {
  const me = useAppSelector((state) => state.users).find((user) => user.username === 'Amir_Aryan')
  if (me)
    return (
      <div className="flex flex-col justify-center space-y-4 mb-4">
        <Avatar placeholderInitials="AA" size="lg" img={me.imageUrl} rounded />
        <div
          className="space-y-1 font-medium dark:text-white                            
      text-slate-700 flex flex-col justify-center text-center"
        >
          <div>{me.name}</div>
          <Link to={`/${me.username}`} className="detail-text">
            @{me.username}
          </Link>
          <div
            className="text-sm text-gray-500 dark:text-gray-400
          flex gap-4 justify-center"
          >
            <p>
              <span className="text-slate-700 dark:text-white">{me.score}</span> score
            </p>
            <p>
              <span className="text-slate-700 dark:text-white">{millify(me.followers.length)}</span>{' '}
              <Link
                className="hover:text-primary-link-button transition
              ease-out dark:hover:text-dark-link-button"
                to={`/${me.username}/followers`}
              >
                followers
              </Link>
            </p>
            <p>
              <span className="text-slate-700 dark:text-white">
                {millify(me.followings.length)}
              </span>{' '}
              <Link
                className="hover:text-primary-link-button transition
              ease-out dark:hover:text-dark-link-button"
                to={`/${me.username}/followings`}
              >
                following
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
}
