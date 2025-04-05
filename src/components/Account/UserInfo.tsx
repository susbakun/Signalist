import { AccountModel } from "@/shared/models"
import { FaUserAlt } from "react-icons/fa"
import { HiIdentification } from "react-icons/hi"
import { IoMail } from "react-icons/io5"

type UserInfoProps = {
  userAccount: AccountModel
  handleShareEmail: () => void
}

export const UserInfo = ({ userAccount, handleShareEmail }: UserInfoProps) => {
  return (
    <div className="flex flex-col gap-3 md:gap-2 font-sans p-2 md:p-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 min-w-[24px]">
          <HiIdentification className="w-5 h-5" />:
        </span>
        <span className="break-all">{userAccount.name}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 min-w-[24px]">
          <FaUserAlt className="w-4 h-4" />:
        </span>
        <span className="break-all">@{userAccount.username}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 min-w-[24px]">
          <IoMail className="w-4 h-4" />:
        </span>
        <button
          className="text-primary-link-button action-button break-all
              dark:text-dark-link-button"
          onClick={handleShareEmail}
        >
          {userAccount.email}
        </button>
      </div>
      {userAccount.bio && (
        <div className="mt-2">
          <p className="whitespace-pre-wrap break-words text-sm md:text-base">{userAccount.bio}</p>
        </div>
      )}
    </div>
  )
}
