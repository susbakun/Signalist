import { cn } from "@/utils"
import moment from "jalali-moment"
import { BiBrain } from "react-icons/bi"

type FeaturedNewsProps = {
  title: string
  description?: string
  source: string
  publishedAt: string
  url: string
  handleOpenAiModal: () => void
}

export const FeaturedNews = ({
  title,
  description,
  source,
  publishedAt,
  url,
  handleOpenAiModal
}: FeaturedNewsProps) => {
  return (
    <div
      className="w-full relative h-[400px] md:h-[450px] lg:h-[500px]
      mb-4 overflow-hidden rounded-md"
    >
      <img
        src={"https://crypto.snapi.dev/images/v1/placeholders/crypto/crypto55.jpg"}
        alt="News Banner"
        className="w-full h-full object-cover rounded-md"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t
       from-black/80 via-black/20 to-transparent rounded-md"
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t
       from-black/90 via-black/40 to-transparent rounded-b-md"
      />

      <h3
        className="text-lg text-white font-medium absolute
        top-0 left-0 right-0 p-4 z-10"
      >
        Featured News
      </h3>

      <div className="flex flex-col gap-2 absolute bottom-0 left-0 right-0 p-4 z-10">
        <h4 className="text-xl font-bold text-white drop-shadow-lg">{title}</h4>
        <p className="text-sm text-white/90 drop-shadow-md">{description}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-white/90 drop-shadow-sm">{source}</p>
          <p className="text-sm text-white/90 drop-shadow-sm">
            {moment(publishedAt).format("MMMM Do, YYYY")}
          </p>
          <p className="text-sm text-red-400 font-bold drop-shadow-sm">Negative</p>
        </div>
        <div className="flex items-center gap-2">
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
