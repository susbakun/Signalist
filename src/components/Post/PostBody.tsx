import { BluredPostComponent } from "@/components"
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

  const client = new Client()
  const storage = new Storage(client)
  client.setEndpoint("https://cloud.appwrite.io/v1").setProject("66747b890009cb1b3f8a")

  const handleImageClick = () => {
    setEnlarged((prev) => !prev)
  }

  useEffect(() => {
    if (postImageId) {
      const result = storage.getFilePreview(
        "6684ee4300354ad8d7bb",
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
    }
  }, [postImageId])
  return isPremium && !amISubscribed ? (
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
  ) : (
    <div className="flex flex-col gap-3">
      <div className="text-justify mb-1">{content}</div>
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
              "transition-transform duration-300",
              {
                "w-[70%] h-[70%] object-contain": enlarged
              }
            )}
            src={postImageHref}
            alt="Chart"
          />
        </div>
      )}
    </div>
  )
}
