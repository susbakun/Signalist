import { NavLink } from 'react-router-dom'

export const ExploreTopBar = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="px-4">
        <input className="custom-input inline-block" placeholder="Search" />
      </div>
      <div
        className="border-b border-b-gray-600/20 dark:border-b-white/20 flex 
        justify-between px-20"
      >
        <NavLink className="explore-nav-link" to="followings">
          Followings
        </NavLink>
        <NavLink className="explore-nav-link" to="suggests">
          Suggests
        </NavLink>
      </div>
    </div>
  )
}
