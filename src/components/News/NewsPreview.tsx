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
      className="w-full flex rounded-md bg-white
    dark:bg-gray-800 gap-3"
    >
      <div className="max-w-full max-h-full">
        <img
          className="w-[200px] h-[150px] object-cover rounded-md"
          src={urlToImage || demoImageUrl}
          alt={title}
        />
      </div>
      <div className="flex flex-col p-2 w-full h-full">
        <div
          className="h-[110px] max-h-[120px] overflow-y-hidden 
          flex flex-col gap-2"
        >
          <h5
            className="text-xl font-bold tracking-tight
          text-gray-900 dark:text-white"
          >
            {title}
          </h5>
          <p
            className="font-normal text-sm text-gray-500
          dark:text-white/60"
          >
            {description.length > 100 ? `${description.substring(0, 400)}` : description}
          </p>
        </div>
        <div className="flex items-center justify-between pr-2">
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
