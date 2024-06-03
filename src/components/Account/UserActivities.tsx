import { NavLink } from 'react-router-dom'

type UserActivitiesProps = {
  handleChangeActiveLink: (path: string) => void
}

export const UserActivities = ({ handleChangeActiveLink }: UserActivitiesProps) => {
  return (
    <div
      className="border-y border-x border-y-gray-600/20
          dark:border-y-white/20 flex justify-between
            px-10 items-center pt-[6px] border-x-gray-600/20
            dark:border-x-white/20"
    >
      <NavLink
        onClick={() => handleChangeActiveLink('posts')}
        className="explore-nav-link"
        to="posts"
      >
        Posts
      </NavLink>
      <NavLink
        onClick={() => handleChangeActiveLink('signals')}
        className="explore-nav-link"
        to="signals"
      >
        Signals
      </NavLink>
      <NavLink
        onClick={() => handleChangeActiveLink('replies')}
        className="explore-nav-link"
        to="replies"
      >
        Replies
      </NavLink>
    </div>
  )
}
