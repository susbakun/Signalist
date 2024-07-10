import { AccountModel } from '@/shared/models'
import { Avatar } from 'flowbite-react'

type UserPremiumModalUserInfoProps = {
  userAccount: AccountModel
}

export const UserPremiumModalUserInfo = ({ userAccount }: UserPremiumModalUserInfoProps) => {
  return (
    <>
      <Avatar placeholderInitials="AA" size="xl" img={userAccount.imageUrl} rounded />
      <div
        className="space-y-1 font-medium dark:text-white                            
            text-slate-700 flex flex-col justify-center text-center"
      >
        <div>{userAccount.name}</div>
        <div className="detail-text">@{userAccount.username}</div>
        <div>score: {userAccount.score}</div>
      </div>
    </>
  )
}
