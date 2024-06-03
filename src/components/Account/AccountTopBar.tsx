import {
  SubscriberSign,
  UserNotificationsButton,
  UserOptionsButton,
  UserStreamButton
} from '@/components'
import { useIsUserSubscribed } from '@/hooks/useIsUserSubscribed'
import { AccountModel } from '@/shared/models'
import { cn, getAvatarPlaceholder } from '@/utils'
import { Avatar } from 'flowbite-react'
import { useState } from 'react'
import { ProfilePageMoreOptionButton } from '../Button/MoreOptionsButton/ProfilePageMoreOptionButton'
import { UserNumericInfo } from './UserNumericInfo'

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
    <div className={cn('flex items-center gap-36 relative', { 'gap-20 pt-2': !isItmMyAccount })}>
      <Avatar
        bordered
        placeholderInitials={placeholder}
        size="xl"
        img={userAccount.imageUrl}
        rounded
      />
      {isItmMyAccount && <UserStreamButton />}
      {isItmMyAccount ? (
        <UserOptionsButton handleOpen={handleOpen} open={open} setIsOpen={setIsOpen} />
      ) : (
        <div className="flex gap-10 absolute top-0 right-0">
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
      <UserNumericInfo userAccount={userAccount} />
    </div>
  )
}
