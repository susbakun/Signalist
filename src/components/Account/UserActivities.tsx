import { NavLink } from "react-router-dom"

type UserActivitiesProps = {
  handleChangeActiveLink: (path: string) => void
}

export const UserActivities = ({ handleChangeActiveLink }: UserActivitiesProps) => {
  return (
    <div
      className="border-y border-x border-y-gray-600/20 dark:border-y-white/20 mt-2
      flex justify-between items-center border-x-gray-600/20 dark:border-x-white/20
      mx-0
      "
    >
      <NavLink
        onClick={() => handleChangeActiveLink("posts")}
        className="explore-nav-link flex-1 text-center py-2 text-sm sm:text-base"
        to="posts"
      >
        Posts
      </NavLink>
      <NavLink
        onClick={() => handleChangeActiveLink("signals")}
        className="explore-nav-link flex-1 text-center py-2 text-sm sm:text-base"
        to="signals"
      >
        Signals
      </NavLink>
      <NavLink
        onClick={() => handleChangeActiveLink("replies")}
        className="explore-nav-link flex-1 text-center py-2 text-sm sm:text-base"
        to="replies"
      >
        Replies
      </NavLink>
    </div>
  )
}
