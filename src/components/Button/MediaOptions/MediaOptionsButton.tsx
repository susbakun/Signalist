import { Popover } from "flowbite-react"
import { ChangeEvent, useState } from "react"
import { CiLink } from "react-icons/ci"
import { MediaOptionsButtonContent } from "./MediaOptionsButtonContent"

type MediaOptionsButtonProps = {
  handleChangeImage: (e: ChangeEvent<HTMLInputElement>) => void
}

export const MediaOptionsButton = ({ handleChangeImage }: MediaOptionsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover
      trigger="click"
      placement="top"
      aria-labelledby="more-options"
      content={<MediaOptionsButtonContent handleChangeImage={handleChangeImage} />}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <button className="action-button">
        <CiLink className="w-7 h-7" />
      </button>
    </Popover>
  )
}
