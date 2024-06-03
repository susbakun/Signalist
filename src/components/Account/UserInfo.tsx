import { AccountModel } from '@/shared/models'
import { FaUserAlt } from 'react-icons/fa'
import { HiIdentification } from 'react-icons/hi'
import { IoMail } from 'react-icons/io5'

type UserInfoProps = {
  userAccount: AccountModel
  handleShareEmail: () => void
}

export const UserInfo = ({ userAccount, handleShareEmail }: UserInfoProps) => {
  return (
    <div className="flex flex-col gap-2 font-sans">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          <HiIdentification />:
        </span>
        {userAccount.name}
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          <FaUserAlt />:
        </span>
        @{userAccount.username}
      </div>
      <div className="flex items-center gap-1">
        <IoMail />:
        <button
          className="text-primary-link-button action-button
              dark:text-dark-link-button ml-1"
          onClick={handleShareEmail}
        >
          {userAccount.email}
        </button>
      </div>
      {userAccount.bio && (
        <div>
          <p>{userAccount.bio}</p>
        </div>
      )}
    </div>
  )
}
