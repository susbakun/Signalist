import { sizeClasses } from "@/shared/constants"
import { twMerge } from "tailwind-merge"

type CustomAvatarProps = {
  img?: string
  placeholderInitials?: string
  size?: keyof typeof sizeClasses
  rounded?: boolean
  bordered?: boolean
  wrapperClassName?: string
  className?: string
  alt?: string
}

export const CustomAvatar = ({
  img,
  placeholderInitials = "U",
  size = "md",
  rounded = true,
  bordered = false,
  wrapperClassName,
  className,
  alt = "Avatar"
}: CustomAvatarProps) => {
  const sizeClass = sizeClasses[size]
  const roundedClass = rounded ? "rounded-full" : "rounded-lg"
  const borderedClass = bordered ? "ring-2 ring-gray-300 dark:ring-gray-500" : ""

  const baseClasses = twMerge(
    "flex items-center justify-center bg-gray-100 dark:bg-gray-600",
    "text-gray-600 dark:text-gray-300 font-medium flex-shrink-0",
    sizeClass,
    roundedClass,
    borderedClass,
    className
  )

  return (
    <div
      className={twMerge(
        "relative flex-shrink-0 w-full h-full flex items-center justify-center",
        wrapperClassName
      )}
    >
      {img ? (
        <img src={img} alt={alt} className={twMerge(baseClasses, "object-cover")} />
      ) : (
        <div className={baseClasses}>{placeholderInitials}</div>
      )}
    </div>
  )
}
