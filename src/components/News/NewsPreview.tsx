import { demoImageUrl } from "@/shared/constants";
import { NewsItem } from "@/shared/models";
import { cn } from "@/utils";
import moment from "jalali-moment";
import { ComponentProps } from "react";

type NewsPreviewProps = ComponentProps<"div"> & NewsItem & {isCompatMode?: boolean}

export const NewsPreview = ({
  title,
  url,
  imageurl,
  published_on,
  body,
  isCompatMode
}: NewsPreviewProps) => {
  const timestamp = moment.unix(published_on).format('YYYY-MM-DD HH:mm:ss');
  return (
    <div
      className="w-full flex rounded-md bg-white h-[180px]
    dark:bg-gray-800 gap-3"
    >
      <div className="max-w-full max-h-full p-2">
        <img
          className={cn("h-full object-cover rounded-md",
            {
              "w-[280px]" : !isCompatMode,
              "w-[300px]" : isCompatMode
            }
          )}
          src={imageurl || demoImageUrl}
          alt={title}
        />
      </div>
      <div className="flex flex-col px-2 py-2 w-full h-full">
        <div className="flex flex-col gap-2 h-[80%] overflow-hidden pb-2">
          <h5
            className={cn("font-bold tracking-tight",
            "text-gray-900 dark:text-white",
            {"text-md" : isCompatMode,
              "text-xl" : !isCompatMode
            }
          )}
          >
            {title}
          </h5>
          <p
            className="font-normal text-sm text-gray-500
          dark:text-white/60 line-clamp-3"
          >
            {body}
          </p>
        </div>
        <div className="flex items-center justify-between pr-2 flex-1">
          <a
            target="_blank"
            href={url}
            className={cn("text-primary-link-button dark:text-dark-link-button",
            "hover:opacity-60 transition-all ease-out font-medium",
            {
              "text-sm" : isCompatMode,
              "text-md" : !isCompatMode
            }
          )}
            rel="noopener noreferrer"
          >
            Visit Website
          </a>
          <p className={cn({
            "text-sm" : isCompatMode,
            "text-md" : !isCompatMode
          })}
          >{moment(timestamp).startOf("m").fromNow()}</p>
        </div>
      </div>
    </div>
  );
};
