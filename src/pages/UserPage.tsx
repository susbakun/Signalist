import { AccountBottomBar, AccountTopBar, Loader, UserActivities, UserInfo } from "@/components"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useUserAccount } from "@/hooks/useUserAccount"
import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"

export const UserPage = () => {
  const [activeLink, setActiveLink] = useState("posts")

  const navigate = useNavigate()
  const location = useLocation()

  const { username: profileUsername } = useParams()

  // Get users state with loading

  const { currentUser: myAccount, currentUserLoading } = useCurrentUser()
  const { userAccount, loading: userAccountLoading } = useUserAccount(profileUsername)
  const isItmyAccount = profileUsername === myAccount?.username

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

  // Show loading if users are still being fetched
  if (currentUserLoading || userAccountLoading) {
    return <Loader className="h-screen" />
  }

  if (!myAccount && !(currentUserLoading && userAccountLoading))
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <h2 className="text-2xl font-bold mb-4 text-center">User not found</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center">You're not authenticated</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-6 px-4 py-2 bg-primary-link-button dark:bg-dark-link-button text-white rounded-lg"
        >
          Return to Home
        </button>
      </div>
    )

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

  if (myAccount)
    return (
      <>
        <div className="flex flex-col px-4 md:px-16 pt-4 md:pt-6 gap-3 md:gap-6">
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
