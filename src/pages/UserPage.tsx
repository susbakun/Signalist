import { AccountBottomBar, AccountTopBar, UserActivities, UserInfo } from "@/components"
import { useAppSelector } from "@/features/Post/postsSlice"
import { getCurrentUsername } from "@/utils"
import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"

export const UserPage = () => {
  const [activeLink, setActiveLink] = useState("posts")

  const navigate = useNavigate()
  const location = useLocation()

  const { username: profileUsername } = useParams()
  const currentUsername = getCurrentUsername()

  const userAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === profileUsername
  )
  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === currentUsername
  )
  const isItmyAccount = profileUsername === currentUsername

  const handleShareEmail = () => {
    if (userAccount?.email) {
      const shareUrl = `mailto:${userAccount.email}`
      window.open(shareUrl)
    }
  }

  const handleChangeActiveLink = (pathName: string) => {
    setActiveLink(pathName)
  }

  useEffect(() => {
    if (location.pathname === `/${userAccount?.username}`) {
      navigate(activeLink, { replace: false })
    }
  }, [location, navigate, userAccount?.username, activeLink])

  // If the profile doesn't exist, show a message
  if (!userAccount) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <h2 className="text-2xl font-bold mb-4 text-center">User not found</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          The user you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-4 py-2 bg-primary-link-button dark:bg-dark-link-button text-white rounded-lg"
        >
          Return to Home
        </button>
      </div>
    )
  }

  // If we're not logged in or our account is not found, we can't show components that require myAccount
  if (!myAccount) {
    return (
      <>
        <div className="flex flex-col px-4 md:px-6 lg:px-8 xl:px-16 2xl:px-32 pt-4 md:pt-6 gap-3 md:gap-6">
          <UserInfo handleShareEmail={handleShareEmail} userAccount={userAccount} />
          <UserActivities handleChangeActiveLink={handleChangeActiveLink} />
        </div>
        <Outlet />
      </>
    )
  }

  // If both userAccount and myAccount exist, show the full profile
  return (
    <>
      <div className="flex flex-col px-4 md:px-6 lg:px-8 xl:px-16 2xl:px-32 pt-4 md:pt-6 gap-3 md:gap-6">
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
