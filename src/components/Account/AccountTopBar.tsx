import {
  ProfilePageMoreOptionButton,
  SubscriberSign,
  UserNotificationsButton,
  UserOptionsButton,
  UserStreamButton
} from "@/components"
import { useIsUserSubscribed } from "@/hooks/useIsUserSubscribed"
import { AccountModel } from "@/shared/models"
import { getAvatarPlaceholder } from "@/utils"
import { CustomAvatar } from "@/components"
import { useState } from "react"
import { UserNumericInfo } from "./UserNumericInfo"

type AccountTopBarProps = {
  userAccount: AccountModel
  myAccount: AccountModel
  isItmMyAccount: boolean
}

export const AccountTopBar = ({ isItmMyAccount, userAccount, myAccount }: AccountTopBarProps) => {
  const [open, setIsOpen] = useState(false)
  const placeholder = getAvatarPlaceholder(userAccount.name)

  const { amISubscribed } = useIsUserSubscribed(userAccount)

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  return (
    <div className="flex flex-col sm:flex-row w-full">
      <div className="flex items-center mb-4 sm:mb-0 relative w-full">
        <div className="flex items-center w-fit md:w-full gap-[25%]">
          <CustomAvatar
            bordered
            placeholderInitials={placeholder}
            size="xl"
            img={userAccount.imageUrl}
            wrapperClassName="w-40 h-40"
            rounded
          />
          <div className="hidden md:flex mt-1 mb-4">
            <UserNumericInfo userAccount={userAccount} />
          </div>
        </div>
        <div className="ml-4 sm:hidden">
          <div className="font-medium">{userAccount.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">@{userAccount.username}</div>
        </div>
        {isItmMyAccount && <UserStreamButton />}
      </div>

      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between">
        <div className="block md:hidden">
          <UserNumericInfo userAccount={userAccount} />
        </div>

        {isItmMyAccount ? (
          <UserOptionsButton handleOpen={handleOpen} open={open} setIsOpen={setIsOpen} />
        ) : (
          <div className="flex gap-2 sm:gap-4 absolute top-4 right-4 md:right-8 lg:right-12">
            {amISubscribed && <SubscriberSign />}
            <UserNotificationsButton />
            <ProfilePageMoreOptionButton
              handleClose={handleClose}
              handleOpen={handleOpen}
              myAccount={myAccount}
              open={open}
              setIsOpen={setIsOpen}
              userUsername={userAccount.username}
            />
          </div>
        )}
      </div>
    </div>
  )
}
