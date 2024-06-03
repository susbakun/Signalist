import { AccountModel } from '@/shared/models'
import { MyBottomBar } from './MyBottomBar'
import { OthersBottomBar } from './OthersBottomBar'

type AccountBottomBarProps = {
  isItMyAccount: boolean
  userAccount: AccountModel
  myAccount: AccountModel
}

export const AccountBottomBar = ({
  isItMyAccount,
  myAccount,
  userAccount
}: AccountBottomBarProps) => {
  return isItMyAccount ? (
    <MyBottomBar />
  ) : (
    <OthersBottomBar myAccount={myAccount} userAccount={userAccount} />
  )
}
