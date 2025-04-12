import { twMerge } from "tailwind-merge"

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
  return (
    <div className={twMerge("gradient-border rounded-full", className)}>
      <div className="bg-dark-main dark:bg-dark-main rounded-full p-[2px]">
        {imageUrl ? (
          <div className="relative overflow-hidden rounded-full">
            <img
              src={imageUrl}
              alt={`${placeholderInitials}'s avatar`}
              className="w-full h-full object-cover"
              style={{
                width:
                  size === "xs"
                    ? "24px"
                    : size === "sm"
                      ? "32px"
                      : size === "md"
                        ? "40px"
                        : size === "lg"
                          ? "64px"
                          : "96px",
                height:
                  size === "xs"
                    ? "24px"
                    : size === "sm"
                      ? "32px"
                      : size === "md"
                        ? "40px"
                        : size === "lg"
                          ? "64px"
                          : "96px"
              }}
            />
          </div>
        ) : (
          <div
            className="flex items-center justify-center text-white bg-gray-500 rounded-full"
            style={{
              width:
                size === "xs"
                  ? "24px"
                  : size === "sm"
                    ? "32px"
                    : size === "md"
                      ? "40px"
                      : size === "lg"
                        ? "64px"
                        : "96px",
              height:
                size === "xs"
                  ? "24px"
                  : size === "sm"
                    ? "32px"
                    : size === "md"
                      ? "40px"
                      : size === "lg"
                        ? "64px"
                        : "96px",
              fontSize:
                size === "xs"
                  ? "10px"
                  : size === "sm"
                    ? "14px"
                    : size === "md"
                      ? "16px"
                      : size === "lg"
                        ? "20px"
                        : "28px"
            }}
          >
            {placeholderInitials}
          </div>
        )}
      </div>
    </div>
  )
}
