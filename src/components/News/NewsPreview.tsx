import { demoImageUrl } from "@/shared/constants"
import { CryptoCurrency } from "@/shared/models"
import { cn } from "@/utils"
import moment from "jalali-moment"

type NewsPreviewProps = {
  id?: number
  kind?: string
  domain?: string
  slug?: string
  created_at?: string
  title: string
  url: string
  imageurl?: string | null
  body?: string
  published_on: number
  source: string
  currencies?: CryptoCurrency[] | null
  isCompatMode?: boolean
}

export const NewsPreview = ({
  title,
  url,
  imageurl,
  published_on,
  currencies,
  isCompatMode,
  body
}: NewsPreviewProps) => {
  const timestamp = moment.unix(published_on).format("YYYY-MM-DD HH:mm:ss")

  return (
    <div
      className="w-full flex flex-col md:flex-row rounded-md bg-white 
      h-[400px] md:h-[180px] dark:bg-gray-800 gap-3 overflow-hidden"
    >
      <div className="w-full md:w-fit md:max-w-full p-2 overflow-hidden">
        <div className="h-[250px] md:h-[160px] w-full overflow-hidden rounded-md">
          <img
            className={cn("w-full h-full object-cover rounded-md", {
              "md:w-[280px]": !isCompatMode,
              "md:w-[300px]": isCompatMode
            })}
            src={imageurl || demoImageUrl}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = demoImageUrl
            }}
          />
        </div>
      </div>
      <div className="flex flex-col px-2 py-2 w-full h-full overflow-hidden">
        <div className="flex flex-col gap-2 overflow-hidden pb-2">
          <h5
            className={cn(
              "font-bold tracking-tight line-clamp-2",
              "text-gray-900 dark:text-white",
              {
                "text-md": isCompatMode,
                "text-xl": !isCompatMode
              }
            )}
          >
            {title}
          </h5>

          {body && (
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2 max-w-full break-words">
              {body}
            </p>
          )}

          {/* Currency Tags */}
          {currencies && currencies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1 z-10 relative">
              {currencies.map((currency) => (
                <span
                  key={currency.code}
                  className="bg-primary-link-button/10 dark:bg-dark-link-button/20
                text-primary-link-button dark:text-dark-link-button rounded-md
                  px-2 py-0.5 text-xs font-medium"
                >
                  {currency.code}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pr-2 mt-auto">
          <a
            target="_blank"
            href={url}
            className={cn(
              "text-primary-link-button dark:text-dark-link-button",
              "hover:opacity-60 transition-all ease-out font-medium truncate",
              {
                "text-sm": isCompatMode,
                "text-md": !isCompatMode
              }
            )}
            rel="noopener noreferrer"
          >
            Visit Website
          </a>
          <p
            className={cn("whitespace-nowrap", {
              "text-sm": isCompatMode,
              "text-md": !isCompatMode
            })}
          >
            {moment(timestamp).fromNow()}
          </p>
        </div>
      </div>
    </div>
  )
}
