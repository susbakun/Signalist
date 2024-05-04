import { ReactNode } from 'react'
import {
  IoBarChart,
  IoBarChartOutline,
  IoHome,
  IoHomeOutline,
  IoMail,
  IoMailOutline,
  IoSearch,
  IoSearchOutline
} from 'react-icons/io5'
import { TbCoinFilled, TbPremiumRights } from 'react-icons/tb'
import { NavLink, useLocation } from 'react-router-dom'

export const Navbar = () => {
  const location = useLocation()

  // Function to determine the appropriate icon based on the active link
  const getIcon = (path: string, activeIcon: ReactNode, inactiveIcon: ReactNode) => {
    return location.pathname === path ? activeIcon : inactiveIcon
  }

  return (
    <nav className="flex flex-col gap-4 pr-4">
      <NavLink className="link-button" to="/">
        {getIcon(
          '/',
          <IoHome className="w-full button-icon" />,
          <IoHomeOutline className="w-full button-icon" />
        )}
        <span>Home</span>
      </NavLink>
      <NavLink className="link-button" to="/explore">
        {getIcon(
          '/explore',
          <IoSearch className="w-full button-icon" />,
          <IoSearchOutline className="w-full button-icon" />
        )}
        <span>Explore</span>
      </NavLink>
      <NavLink className="link-button" to="/signals">
        {getIcon(
          '/signals',
          <IoBarChart className="w-full button-icon" />,
          <IoBarChartOutline className="w-full button-icon" />
        )}
        <span>Signals</span>
      </NavLink>
      <NavLink className="link-button" to="/messages">
        {getIcon(
          '/messages',
          <IoMail className="w-full button-icon" />,
          <IoMailOutline className="w-full button-icon" />
        )}
        <span>Messages</span>
      </NavLink>
      <NavLink className="link-button" to="/premium">
        {getIcon(
          '/premium',
          <TbCoinFilled className="w-full button-icon" />,
          <TbPremiumRights className="w-full button-icon" />
        )}
        <span>Premium</span>
      </NavLink>
    </nav>
  )
}
