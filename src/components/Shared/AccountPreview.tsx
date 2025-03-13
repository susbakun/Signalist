import { useCurrentUser } from "@/hooks/useCurrentUser"
import { Avatar } from "flowbite-react"
import millify from "millify"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export const AccountPreview = () => {
  const { currentUser } = useCurrentUser()
  const [size, setSize] = useState("lg")

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        setSize("xl")
      } else {
        setSize("lg")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!currentUser) return null

  return (
    <div className="flex flex-col justify-center space-y-4 mb-4">
      <Avatar
        placeholderInitials={currentUser.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
        size={size}
        img={currentUser.imageUrl}
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
              following
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
