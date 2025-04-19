import { BluredPostComponent, Loader } from "@/components" // Adjust the import path as needed
import { AccountModel, PostModel } from "@/shared/models"
import { cn } from "@/utils"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

type PostBodyProps = {
  content: PostModel["content"]
  amISubscribed?: boolean
  publisherUsername: AccountModel["username"]
  isPremium: boolean
  postImageHref?: string
}

export const PostBody = ({
  content,
  publisherUsername,
  amISubscribed,
  isPremium,
  postImageHref
}: PostBodyProps) => {
  const [enlarged, setEnlarged] = useState(false)
  const [isImageLoading, setisImageLoading] = useState(false)

  const handleImageClick = () => {
    setEnlarged((prev) => !prev)
  }

  const handleImageLoaded = () => {
    setisImageLoading(false)
  }

  useEffect(() => {
    if (postImageHref) {
      setisImageLoading(true)
    }
  }, [postImageHref])

  const parseContent = (text: string) => {
    const words = text.split(" ")
    return words.map((word, index) => {
      if (word.startsWith("#")) {
        const hashtag = word.substring(1)
        return (
          <Link
            key={index}
            to={`/hashtag/${hashtag}`}
            className="dark:text-dark-link-button
            text-primary-link-button hover:opacity-70 px-[2px]
            transition-all duration-100 ease-out"
          >
            {word}
          </Link>
        )
      } else {
        return <span key={index}>{word} </span>
      }
    })
  }

  if (isPremium && !amISubscribed) {
    return (
      <div className="relative rounded-lg overflow-x-hidden">
        <BluredPostComponent />
        <Link
          to={`/${publisherUsername}/premium`}
          className="absolute top-[50%] left-[50%] -translate-x-[50%]
          -translate-y-[50%] action-button text-white bg-gradient-to-r
        dark:from-dark-link-button from-primary-link-button to-[#ff00e5]
        dark:to-[#ff00e5] px-3 py-2 rounded-md"
        >
          Subscribe
        </Link>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col gap-3">
        <div className="mb-1">{parseContent(content)}</div>
        {isImageLoading && <Loader className="h-[350px]" />}{" "}
        {postImageHref && (
          <div
            className={cn(
              "relative w-full h-full rounded mb-4",
              {
                "fixed inset-0 z-50 flex items-center": enlarged
              },
              { "justify-center bg-black bg-opacity-75": enlarged }
            )}
            onClick={handleImageClick}
          >
            <img
              className={cn(
                "w-full object-cover cursor-pointer rounded-lg",
                "transition-opacity duration-300 opacity-100",
                "h-full md:max-h-[600px] md:object-contain",
                {
                  "w-[90%] h-auto max-h-[90vh] object-contain": enlarged,
                  "opacity-0 h-0": isImageLoading
                }
              )}
              src={postImageHref}
              alt="Post image"
              onLoad={handleImageLoaded}
              onError={handleImageLoaded}
            />
          </div>
        )}
      </div>
    )
  }
}
