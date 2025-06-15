import { twMerge } from "tailwind-merge"
import { CustomAvatar } from "./CustomAvatar"

type StreamingUserAvatarProps = {
  imageUrl?: string
  placeholderInitials: string
  className?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}

export const StreamingUserAvatar = ({
  imageUrl,
  placeholderInitials,
  className,
  size = "md"
}: StreamingUserAvatarProps) => {
  const sizeStyles = {
    xs: { width: "24px", height: "24px", fontSize: "10px" },
    sm: { width: "32px", height: "32px", fontSize: "14px" },
    md: { width: "40px", height: "40px", fontSize: "16px" },
    lg: { width: "64px", height: "64px", fontSize: "20px" },
    xl: { width: "96px", height: "96px", fontSize: "28px" }
  }

  const currentSize = sizeStyles[size]

  return (
    <div className={twMerge("gradient-border rounded-full", className)} style={currentSize}>
      <div className="bg-dark-main dark:bg-dark-main rounded-full p-[2px] w-full h-full">
        {imageUrl ? (
          <CustomAvatar
            img={imageUrl}
            alt={`${placeholderInitials}'s avatar`}
            placeholderInitials={placeholderInitials}
            size={size}
            rounded
            wrapperClassName="w-full h-full"
          />
        ) : (
          <div
            className="flex items-center justify-center text-white bg-gray-500 rounded-full w-full h-full"
            style={{ fontSize: currentSize.fontSize }}
          >
            {placeholderInitials}
          </div>
        )}
      </div>
    </div>
  )
}
