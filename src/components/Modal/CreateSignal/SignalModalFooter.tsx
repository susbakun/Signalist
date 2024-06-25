import { cn, isDarkMode } from "@/utils"
import { CiLink } from "react-icons/ci"
import Toggle from "react-toggle"

type SignalModalFooterProps = {
  handleCreateSignal: () => void
  handlePremiumToggle: () => void
  isPremium: boolean
}

export const SignalModalFooter = ({
  handleCreateSignal,
  handlePremiumToggle,
  isPremium
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
        onClick={handleCreateSignal}
        className="action-button dark:text-dark-link-button
      text-primary-link-button font-bold"
      >
        Post
      </button>
    </div>
  )
}
