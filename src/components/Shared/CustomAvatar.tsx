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
          <div className="absolute inset-0 z-0 overflow-hidden rounded-full">
            <img src={img} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="invisible">
            <Avatar img={img} className={className} {...props} />
          </div>
        </>
      ) : (
        <Avatar className={className} {...props} />
      )}
    </div>
  )
}
