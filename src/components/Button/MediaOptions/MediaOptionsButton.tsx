import { Popover } from "flowbite-react"
import { useState } from "react"
import { CiLink } from "react-icons/ci"
import { MediaOptionsButtonContent } from "./MediaOptionsButtonContent"

export const MediaOptionsButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover
      trigger="click"
      placement="top"
      aria-labelledby="more-options"
      content={<MediaOptionsButtonContent />}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <button className="action-button">
        <CiLink className="w-7 h-7" />
      </button>
    </Popover>
  )
}
