import { AccountModel } from '@/shared/models'
import millify from 'millify'
import { Link } from 'react-router-dom'

type UserNumericInfoProps = {
  userAccount: AccountModel
}

export const UserNumericInfo = ({ userAccount }: UserNumericInfoProps) => {
  return (
    <div
      className="text-lg text-gray-500 dark:text-gray-400
      flex gap-14 items-center font-medium"
    >
      <div className="flex flex-col items-center">
        <span className="text-slate-700 dark:text-white">{userAccount.score}</span>
        <span className="text-gray-600/70 dark:text-white/70">score</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-slate-700 dark:text-white">
          {millify(userAccount.followers.length)}
        </span>{' '}
        <Link
          className="hover:text-primary-link-button transition
                  ease-out hover:dark:text-dark-link-button
                text-gray-600/70 dark:text-white/70"
          to={`/${userAccount.username}/followers`}
        >
          followers
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-slate-700 dark:text-white">
          {millify(userAccount.followings.length)}
        </span>{' '}
        <Link
          className="hover:text-primary-link-button transition
                  ease-out hover:dark:text-dark-link-button
                text-gray-600/70 dark:text-white/70"
          to={`/${userAccount.username}/followings`}
        >
          following
        </Link>
      </div>
    </div>
  )
}
