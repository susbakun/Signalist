import { demoImageUrl } from "@/shared/constants"
import { CryptoCurrency } from "@/shared/models"
import { cn } from "@/utils"
import { BiBrain } from "react-icons/bi"
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
  published_on: string
  source: string
  currencies?: CryptoCurrency[] | null
  isCompatMode?: boolean
  handleOpenAiModal: () => void
}

export const NewsPreview = ({
  title,
  url,
  imageurl,
  published_on,
  currencies,
  isCompatMode,
  body,
  handleOpenAiModal,
  source
}: NewsPreviewProps) => {
  return (
    <div
      className="w-full flex flex-col md:flex-row rounded-md bg-white 
      dark:bg-gray-800 gap-3 overflow-hidden pb-2"
    >
      <div className="w-full md:w-fit md:max-w-full p-2 overflow-hidden h-full">
        <div className="w-full overflow-hidden rounded-md h-[230px]">
          <img
            className={cn("w-full h-full object-cover rounded-md", {
              "md:w-[340px]": !isCompatMode,
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
      <div
        className="flex flex-col px-2 py-2 w-full h-[246px]
        justify-between gap-4"
      >
        <div className="flex flex-col gap-2 pb-2">
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
            <p
              className="text-sm text-gray-700 dark:text-gray-300
              line-clamp-2 mb-2 max-w-full break-words"
            >
              {body}
            </p>
          )}

          <div className="flex items-center gap-2">
            <p className="text-sm text-white/80">{source}</p>
            <p className="text-sm text-white/80">{moment(published_on).format("MMMM Do, YYYY")}</p>
            <span className="text-sm text-green-500 font-bold">Positive</span>
          </div>

          {/* Currency Tags */}
          {currencies && currencies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1 z-10 relative">
              {currencies.slice(0, 10).map((currency) => (
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
        <div className="flex gap-2 mt-auto">
          <button
            className="main-button text-sm rounded-xl px-4 py-2 flex items-center gap-1"
            onClick={handleOpenAiModal}
          >
            <BiBrain className="w-4 h-4" />
            AI Analytics
          </button>
          <a
            target="_blank"
            href={url}
            className={cn(
              "main-button text-sm rounded-xl px-4 py-2 text-white",
              "hover:opacity-60 transition-all ease-out font-medium truncate"
            )}
            rel="noopener noreferrer"
          >
            Visit Website
          </a>
        </div>
      </div>
    </div>
  )
}
