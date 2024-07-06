import { MediaOptionsButton } from "@/components"
import { cn, isDarkMode } from "@/utils"
import { ChangeEvent } from "react"
import Toggle from "react-toggle"

type PostModalFooterProps = {
  isPremium: boolean
  postButtonDisabled: boolean
  handleChangeImage: (e: ChangeEvent<HTMLInputElement>) => void
  handleTogglePremium: () => void
  hanldeCreatePost: () => Promise<void>
}

export const PostModalFooter = ({
  isPremium,
  postButtonDisabled,
  handleTogglePremium,
  handleChangeImage,
  hanldeCreatePost
}: PostModalFooterProps) => {
  return (
    <div className="flex justify-between px-2 pb-2">
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
        className="action-button dark:text-dark-link-button
      text-primary-link-button font-bold disabled:opacity-30"
      >
        Post
      </button>
    </div>
  )
}
