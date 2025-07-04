import { CustomAvatar } from "@/components"
import millify from "millify"
import { Link } from "react-router-dom"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { getCurrentUser } from "@/utils"

export const AccountPreview = () => {
  const { currentUser } = useCurrentUser()
  const userSimplified = getCurrentUser()

  if (!currentUser) return <div className="text-center p-4">User not found</div>

  return (
    <div className="flex flex-col justify-center space-y-4 mb-4">
      <CustomAvatar
        placeholderInitials={userSimplified?.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")}
        size="xl"
        img={userSimplified.imageUrl}
        wrapperClassName="w-26 h-26"
        rounded
      />
      <div className="space-y-1 font-medium dark:text-white text-slate-700 flex flex-col justify-center text-center">
        <div>{currentUser.name}</div>
        <Link to={`/${currentUser.username}`} className="detail-text">
          @{currentUser.username}
        </Link>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-4 justify-center">
          <p>
            <span className="text-slate-700 dark:text-white">{currentUser.score}</span> score
          </p>
          <p>
            <span className="text-slate-700 dark:text-white">
              {millify(currentUser.followers.length)}
            </span>{" "}
            <Link
              className="hover:text-primary-link-button transition ease-out dark:hover:text-dark-link-button"
              to={`/${currentUser.username}/followers`}
            >
              followers
            </Link>
          </p>
          <p>
            <span className="text-slate-700 dark:text-white">
              {millify(currentUser.followings.length)}
            </span>{" "}
            <Link
              className="hover:text-primary-link-button transition ease-out dark:hover:text-dark-link-button"
              to={`/${currentUser.username}/followings`}
            >
              followings
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
