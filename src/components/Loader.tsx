import { Spinner } from 'flowbite-react'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type LoaderProps = ComponentProps<'div'>

export const Loader = ({ className, ...props }: LoaderProps) => {
  return (
    <div {...props} className={twMerge('flex justify-center items-center', className)}>
      <Spinner />
    </div>
  )
}
