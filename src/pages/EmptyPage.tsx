import { ComponentProps } from 'react'

type EmptyPageProps = ComponentProps<'div'>

export const EmptyPage = ({ children, ...props }: EmptyPageProps) => {
  return <div {...props}>{children}</div>
}
