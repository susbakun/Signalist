import { BluredPostComponent, Loader } from "@/components" // Adjust the import path as needed
import { appwriteEndpoint, appwritePostsBucketId, appwriteProjectId } from "@/shared/constants"
import { AccountModel, PostModel } from "@/shared/models"
import { cn } from "@/utils"
import { Client, ImageFormat, ImageGravity, Storage } from "appwrite"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

type PostBodyProps = {
  content: PostModel["content"]
  amISubscribed?: boolean
  publisherUsername: AccountModel["username"]
  isPremium: boolean
  postImageId?: string
}

export const PostBody = ({
  content,
  publisherUsername,
  amISubscribed,
  isPremium,
  postImageId
}: PostBodyProps) => {
  const [postImageHref, setPostImageHref] = useState("")
  const [enlarged, setEnlarged] = useState(false)
  const [isImageLoading, setisImageLoading] = useState(false)

  const client = new Client()
  const storage = new Storage(client)
  client.setEndpoint(appwriteEndpoint).setProject(appwriteProjectId)

  const handleImageClick = () => {
    setEnlarged((prev) => !prev)
  }

  const handleImageLoaded = () => {
    setisImageLoading(false)
  }

  useEffect(() => {
    if (postImageId) {
      setisImageLoading(true)
      const result = storage.getFilePreview(
        appwritePostsBucketId,
        postImageId,
        0,
        0,
        ImageGravity.Center,
        100,
        0,
        "fff",
        0,
        1,
        0,
        "fff",
        ImageFormat.Png
      )
      setPostImageHref(result.href)
    } else if (!postImageId) {
      setPostImageHref("")
    }
  }, [postImageId])

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
                "w-full h-full object-cover cursor-pointer",
                "transition-opacity duration-300 opacity-100",
                {
                  "w-[70%] h-[70%] object-contain": enlarged,
                  "opacity-0 h-0": isImageLoading
                }
              )}
              src={postImageHref}
              alt="Chart"
              onLoad={handleImageLoaded}
              onError={handleImageLoaded}
            />
          </div>
        )}
      </div>
    )
  }
}
