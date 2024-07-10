import { cn, isDarkMode } from "@/utils"
import { Spinner } from "flowbite-react"
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
        <label className={cn("flex items-center gap-1", { dark: isDarkMode() })}>
          <span>Premium</span>
          <Toggle onChange={handlePremiumToggle} defaultChecked={isPremium} icons={false} />
        </label>
      </div>
      <button
        disabled={postButtonDisabled}
        onClick={handleCreateSignal}
        className="action-button text-white
        font-bold disabled:opacity-30
        px-[10px] py-1 rounded-lg flex items-center gap-2 dark:bg-dark-link-button
        bg-primary-link-button
      "
      >
        {postButtonDisabled && <Spinner color="success" size="md" />}
        Post
      </button>
    </div>
  )
}
