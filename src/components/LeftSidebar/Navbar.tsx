import { ReactNode } from 'react'
import { BiSolidSearch } from 'react-icons/bi'
import {
  IoBarChart,
  IoBarChartOutline,
  IoHome,
  IoHomeOutline,
  IoMail,
  IoMailOutline,
  IoSearchOutline
} from 'react-icons/io5'
import { TbCoinFilled, TbPremiumRights } from 'react-icons/tb'
import { NavLink, useLocation } from 'react-router-dom'

export const Navbar = () => {
  const location = useLocation()

  // Function to determine the appropriate icon based on the active link
  const getIcon = (pathREG: RegExp, activeIcon: ReactNode, inactiveIcon: ReactNode) => {
    return pathREG.test(location.pathname) ? activeIcon : inactiveIcon
  }

  return (
    <nav className="flex flex-col gap-4 pr-4">
      <NavLink className="link-button" to="/">
        {getIcon(
          /^\/$/,
          <IoHome className="w-full button-icon" />,
          <IoHomeOutline className="w-full button-icon" />
        )}
        <span>Home</span>
      </NavLink>
      <NavLink className="link-button" to="/explore">
        {getIcon(
          /^\/explore*/,
          <BiSolidSearch className="w-full button-icon" />,
          <IoSearchOutline className="w-full button-icon" />
        )}
        <span>Explore</span>
      </NavLink>
      <NavLink className="link-button" to="/signals">
        {getIcon(
          /^\/signals*/,
          <IoBarChart className="w-full button-icon" />,
          <IoBarChartOutline className="w-full button-icon" />
        )}
        <span>Signals</span>
      </NavLink>
      <NavLink className="link-button" to="/messages">
        {getIcon(
          /^\/messages*/,
          <IoMail className="w-full button-icon" />,
          <IoMailOutline className="w-full button-icon" />
        )}
        <span>Messages</span>
      </NavLink>
      <NavLink className="link-button" to="/premium">
        {getIcon(
          /^\/premium*/,
          <TbCoinFilled className="w-full button-icon" />,
          <TbPremiumRights className="w-full button-icon" />
        )}
        <span>Premium</span>
      </NavLink>
    </nav>
  )
}
