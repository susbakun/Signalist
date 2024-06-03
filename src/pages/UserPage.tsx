import { AccountBottomBar, AccountTopBar, UserActivities, UserInfo } from '@/components'
import { useAppSelector } from '@/features/Post/postsSlice'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

export const UserPage = () => {
  const [activeLink, setActiveLink] = useState('posts')

  const navigate = useNavigate()
  const location = useLocation()

  const { username: myUsername } = useParams()

  const userAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === myUsername
  )
  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === 'Amir_Aryan'
  )
  const isItmyAccount = userAccount?.username === 'Amir_Aryan'

  const handleShareEmail = () => {
    const shareUrl = `mailto:${userAccount?.email}`
    window.open(shareUrl)
  }

  const handleChangeActiveLink = (pathName: string) => {
    setActiveLink(pathName)
  }

  useEffect(() => {
    if (location.pathname === `/${userAccount?.username}`) {
      navigate(activeLink, { replace: false })
    }
  }, [location, navigate])

  if (userAccount && myAccount) {
    return (
      <>
        <div className="flex flex-col px-[200px] pt-12 gap-8">
          <AccountTopBar
            myAccount={myAccount}
            isItmMyAccount={isItmyAccount}
            userAccount={userAccount}
          />
          <UserInfo handleShareEmail={handleShareEmail} userAccount={userAccount} />
          <AccountBottomBar
            isItMyAccount={isItmyAccount}
            myAccount={myAccount}
            userAccount={userAccount}
          />
          <UserActivities handleChangeActiveLink={handleChangeActiveLink} />
        </div>
        <Outlet />
      </>
    )
  }
}
