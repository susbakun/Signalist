import { useCurrentUser } from "@/hooks/useCurrentUser"
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

export const MobileNavbar = () => {
  const location = useLocation()

  // Function to determine the appropriate icon based on the active link
  const getIcon = (pathREG: RegExp, activeIcon: React.ReactNode, inactiveIcon: React.ReactNode) => {
    return pathREG.test(location.pathname) ? activeIcon : inactiveIcon
  }

  const { currentUser } = useCurrentUser()

  if (!currentUser) return null

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800
        shadow-md flex justify-around items-center py-4 md:hidden z-50"
      >
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive
              ? "text-white dark:text-white"
              : "text-gray-600 dark:text-gray-300 hover:text-white"
          }
        >
          {getIcon(/^\/$/, <IoHome className="w-6 h-6" />, <IoHomeOutline className="w-6 h-6" />)}
        </NavLink>
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            isActive
              ? "text-white dark:text-white"
              : "text-gray-600 dark:text-gray-300 hover:text-white"
          }
        >
          {getIcon(
            /^\/explore*/,
            <BiSolidSearch className="w-6 h-6" />,
            <IoSearchOutline className="w-6 h-6" />
          )}
        </NavLink>
        <NavLink
          to="/signals"
          className={({ isActive }) =>
            isActive
              ? "text-white dark:text-white"
              : "text-gray-600 dark:text-gray-300 hover:text-white"
          }
        >
          {getIcon(
            /^\/signals*/,
            <IoBarChart className="w-6 h-6" />,
            <IoBarChartOutline className="w-6 h-6" />
          )}
        </NavLink>

        <NavLink
          to="/premium"
          className={({ isActive }) =>
            isActive
              ? "text-white dark:text-white"
              : "text-gray-600 dark:text-gray-300 hover:text-white"
          }
        >
          {getIcon(
            /^\/premium*/,
            <TbCoinFilled className="w-6 h-6" />,
            <TbPremiumRights className="w-6 h-6" />
          )}
        </NavLink>
        <NavLink
          to={`/${currentUser.username}`}
          className={({ isActive }) =>
            isActive
              ? "text-white dark:text-white"
              : "text-gray-600 dark:text-gray-300 hover:text-white"
          }
        >
          {getIcon(
            new RegExp(`^\\/${currentUser.username}(?:\\/.*)?$`),
            <FaUser className="w-6 h-6" />,
            <FaRegUser className="w-6 h-6" />
          )}
        </NavLink>
      </nav>
    </>
  )
}
