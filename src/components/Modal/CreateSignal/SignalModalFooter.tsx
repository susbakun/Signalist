import { cn, isDarkMode } from "@/utils"
import { CiLink } from "react-icons/ci"
import Toggle from "react-toggle"

type SignalModalFooterProps = {
  isPremium: boolean
  postButtonDisabled: boolean
  handleCreateSignal: () => void
  handlePremiumToggle: () => void
}

export const SignalModalFooter = ({
  isPremium,
  postButtonDisabled,
  handleCreateSignal,
  handlePremiumToggle
}: SignalModalFooterProps) => {
  return (
    <div className="flex justify-between px-2 pb-2">
      <div className="flex items-center gap-2">
        <button className="action-button">
          <CiLink className="w-8 h-8" />
        </button>
        <label className={cn("flex items-center gap-1", { dark: isDarkMode() })}>
          <span>Premium</span>
          <Toggle onChange={handlePremiumToggle} defaultChecked={isPremium} icons={false} />
        </label>
      </div>
      <button
        disabled={postButtonDisabled}
        onClick={handleCreateSignal}
        className="action-button dark:text-dark-link-button
      text-primary-link-button font-bold disabled:opacity-30"
      >
        Post
      </button>
    </div>
  )
}
