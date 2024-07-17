import { MediaOptionsButton } from "@/components"
import { cn, isDarkMode } from "@/utils"
import { Spinner } from "flowbite-react"
import { ChangeEvent } from "react"
import Toggle from "react-toggle"

type PostModalFooterProps = {
  isPremium: boolean
  isPostSending: boolean
  postButtonDisabled: boolean
  handleChangeImage: (e: ChangeEvent<HTMLInputElement>) => void
  handleTogglePremium: () => void
  hanldeCreatePost: () => Promise<void>
}

export const PostModalFooter = ({
  isPremium,
  isPostSending,
  postButtonDisabled,
  handleTogglePremium,
  handleChangeImage,
  hanldeCreatePost
}: PostModalFooterProps) => {
  return (
    <div className="flex justify-between px-2 py-2">
      <div className="flex items-center gap-2">
        <MediaOptionsButton handleChangeImage={handleChangeImage} />
        <label className={cn("flex items-center gap-1", { dark: isDarkMode() })}>
          <span>Premium</span>
          <Toggle onChange={handleTogglePremium} defaultChecked={isPremium} icons={false} />
        </label>
      </div>
      <button
        disabled={postButtonDisabled}
        onClick={hanldeCreatePost}
        className="action-button text-white
        font-bold disabled:opacity-30
        px-[10px] py-1 rounded-lg flex items-center gap-2
        dark:bg-dark-link-button bg-primary-link-button"
      >
        {isPostSending && <Spinner color="success" size="md" />}
        Post
      </button>
    </div>
  )
}
