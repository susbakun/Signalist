import { useCurrentUser } from "@/hooks/useCurrentUser"
import { messagesRouteRegExp } from "@/shared/constants"
import { cn, isDarkMode } from "@/utils"
import { ReactNode } from "react"
import { BiSolidSearch } from "react-icons/bi"
import { FaRegUser, FaUser } from "react-icons/fa"
import {
  IoBarChart,
  IoBarChartOutline,
  IoHome,
  IoHomeOutline,
  IoSearchOutline
} from "react-icons/io5"
import { TbCoinFilled, TbPremiumRights } from "react-icons/tb"
import { NavLink, useLocation } from "react-router-dom"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"

const NavbarSkeleton = ({ isInMessages }: { isInMessages: boolean }) => {
  return (
    <SkeletonTheme
      baseColor={isDarkMode() ? "rgb(31 41 55)" : "rgb(255 255 255)"}
      highlightColor={isDarkMode() ? "#828282" : "#ececec"}
    >
      <nav className={cn("flex flex-col lg:gap-3 2xl:gap-5 w-full", { "pr-2 pt-8": isInMessages })}>
        {/* Home skeleton */}
        <div className="link-button">
          {!isInMessages && <Skeleton className="h-6 lg:w-56 xl:w-80 2xl:w-[350px] rounded-md" />}
        </div>

        {/* Explore skeleton */}
        <div className="link-button">
          {!isInMessages && <Skeleton className="h-6 lg:w-56 xl:w-80 2xl:w-[350px] rounded-md" />}
        </div>

        {/* Signals skeleton */}
        <div className="link-button">
          {!isInMessages && <Skeleton className="h-6 lg:w-56 xl:w-80 2xl:w-[350px] rounded-md" />}
        </div>

        {/* Premium skeleton */}
        <div className="link-button">
          {!isInMessages && <Skeleton className="h-6 lg:w-56 xl:w-80 2xl:w-[350px] rounded-md" />}
        </div>

        {/* Profile skeleton */}
        <div className="link-button">
          {!isInMessages && <Skeleton className="h-6 lg:w-56 xl:w-80 2xl:w-[350px] rounded-md" />}
        </div>
      </nav>
    </SkeletonTheme>
  )
}

export const Navbar = () => {
  const location = useLocation()
  const isInMessages = messagesRouteRegExp.test(location.pathname)

  const { currentUser, currentUserLoading, initialLoading } = useCurrentUser()

  // Function to determine the appropriate icon based on the active link
  const getIcon = (pathREG: RegExp, activeIcon: ReactNode, inactiveIcon: ReactNode) => {
    return pathREG.test(location.pathname) ? activeIcon : inactiveIcon
  }

  // Show skeleton while loading
  if (initialLoading || currentUserLoading) {
    return <NavbarSkeleton isInMessages={isInMessages} />
  }

  if (!currentUser) return null

  return (
    <nav className={cn("flex flex-col gap-4 pr-4 w-full", { "pr-2 pt-8": isInMessages })}>
      <NavLink className="link-button" to="/home">
        {getIcon(
          /^\/$/,
          <IoHome className="w-6 h-6 button-icon" />,
          <IoHomeOutline className="w-6 h-6 button-icon" />
        )}
        {!isInMessages && <span className="font-medium">Home</span>}
      </NavLink>
      <NavLink className="link-button" to="/explore">
        {getIcon(
          /^\/explore*/,
          <BiSolidSearch className="w-6 h-6 button-icon" />,
          <IoSearchOutline className="w-6 h-6 button-icon" />
        )}
        {!isInMessages && <span className="font-medium">Explore</span>}
      </NavLink>
      <NavLink className="link-button" to="/signals">
        {getIcon(
          /^\/signals*/,
          <IoBarChart className="w-6 h-6 button-icon" />,
          <IoBarChartOutline className="w-6 h-6 button-icon" />
        )}
        {!isInMessages && <span className="font-medium">Signals</span>}
      </NavLink>
      <NavLink className="link-button" to="/premium">
        {getIcon(
          /^\/premium*/,
          <TbCoinFilled className="w-6 h-6 button-icon" />,
          <TbPremiumRights className="w-6 h-6 button-icon" />
        )}
        {!isInMessages && <span className="font-medium">Premium</span>}
      </NavLink>
      <NavLink className="link-button" to={`${currentUser.username}`}>
        {getIcon(
          new RegExp(`^\\/${currentUser.username}(?:\\/.*)?$`),
          <FaUser className="w-5 h-5" />,
          <FaRegUser className="w-5 h-5" />
        )}
        {!isInMessages && <span className="font-medium">Profile</span>}
      </NavLink>
    </nav>
  )
}
