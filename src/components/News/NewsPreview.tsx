import { demoImageUrl } from '@/shared/constants'
import { CryptoNewsType } from '@/shared/models'
import moment from 'jalali-moment'
import { ComponentProps } from 'react'

type NewsPreviewProps = ComponentProps<'div'> & CryptoNewsType['articles'][0]
export const NewsPreview = ({
  title,
  url,
  urlToImage,
  publishedAt,
  description
}: NewsPreviewProps) => {
  return (
    <div
      className="w-full flex rounded-md bg-white h-[180px]
    dark:bg-gray-800 gap-3"
    >
      <div className="max-w-full max-h-full p-2">
        <img
          className="w-[250px] h-full object-cover rounded-md"
          src={urlToImage || demoImageUrl}
          alt={title}
        />
      </div>
      <div className="flex flex-col px-2 py-2 w-full h-full">
        <div className="flex flex-col gap-2 h-[80%] text-ellipsis overflow-hidden">
          <h5
            className="text-xl font-bold tracking-tight
          text-gray-900 dark:text-white"
          >
            {title}
          </h5>
          <p
            className="font-normal text-sm text-gray-500
          dark:text-white/60 flex-1"
          >
            {description.length > 100 ? `${description.substring(0, 400)}` : description}
          </p>
        </div>
        <div className="flex items-center justify-between pr-2 flex-1">
          <a
            target="_blank"
            href={url}
            className="text-blue-700/90 transition-all ease-out
          dark:hover:text-blue-800 hover:text-blue-900"
          >
            Visit Website
          </a>
          <p>{moment(publishedAt).startOf('d').fromNow()}</p>
        </div>
      </div>
    </div>
  )
}
