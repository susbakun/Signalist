import { messagesRouteRegExp } from "@/shared/constants"
import { cn } from "@/utils"
import { ReactNode } from "react"
import { BiSolidSearch } from "react-icons/bi"
import {
  IoBarChart,
  IoBarChartOutline,
  IoHome,
  IoHomeOutline,
  IoSearchOutline
} from "react-icons/io5"
import { TbCoinFilled, TbPremiumRights } from "react-icons/tb"
import { NavLink, useLocation } from "react-router-dom"

export const Navbar = () => {
  const location = useLocation()
  const isInMessages = messagesRouteRegExp.test(location.pathname)

  // Function to determine the appropriate icon based on the active link
  const getIcon = (pathREG: RegExp, activeIcon: ReactNode, inactiveIcon: ReactNode) => {
    return pathREG.test(location.pathname) ? activeIcon : inactiveIcon
  }

  return (
    <nav className={cn("flex flex-col gap-4 pr-4 w-full", { "pr-2 pt-8": isInMessages })}>
      <NavLink className="link-button" to="/">
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
    </nav>
  )
}
