import { Avatar, AvatarProps } from "flowbite-react"
import { twMerge } from "tailwind-merge"

type CustomAvatarProps = Omit<AvatarProps, "img"> & {
  wrapperClassName?: string
  img?: string
}

export const CustomAvatar = ({ wrapperClassName, className, img, ...props }: CustomAvatarProps) => {
  return (
    <div className={twMerge("relative", wrapperClassName)}>
      {img ? (
        <>
          <div className="absolute inset-0 z-0 overflow-hidden aspect-square h-full flex mx-auto">
            <img src={img} alt="Avatar" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="invisible">
            <Avatar img={img} className={className} {...props} />
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Avatar className={twMerge("w-full h-full text-lg", className)} {...props} />
        </div>
      )}
    </div>
  )
}
