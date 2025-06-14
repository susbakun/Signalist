import { BlackPulse, BluredSignalComponent, GreenPulse, Loader, RedPulse } from "@/components"
import { useIsUserSubscribed } from "@/hooks/useIsUserSubscribed"
import { SignalModel } from "@/shared/models"
import { cn, getCurrentUsername, getMarketScale } from "@/utils"
import moment from "jalali-moment"
import { useEffect, useState } from "react"
import { FaCheck } from "react-icons/fa"
import { IoMdLink } from "react-icons/io"
import { Link } from "react-router-dom"

type SignalContextProps = {
  signal: SignalModel
  isBookmarkPage?: boolean
}

type IsTargetCopiedType = {
  id: string
  isCopied: boolean
}[]

export const SignalContext = ({ signal, isBookmarkPage }: SignalContextProps) => {
  const [isTargetCopied, setIsTargetCopied] = useState<IsTargetCopiedType>(() => {
    return signal.targets.map((target) => ({ id: target.id, isCopied: false }))
  })
  const [chartHref, setChartHref] = useState("")
  const [enlarged, setEnlarged] = useState(false)
  const [isImageLoading, setisImageLoading] = useState(false)

  const { publisher } = signal
  const { amISubscribed } = useIsUserSubscribed(publisher)
  const currentUsername = getCurrentUsername()

  const marketScale = getMarketScale(signal.market.name)

  const handleCopyTargetValue = async (target: SignalModel["targets"][0], index: number) => {
    setIsTargetCopied((prev) => {
      const updatedTargets = [...prev]
      updatedTargets[index].isCopied = true
      return updatedTargets
    })
    setTimeout(() => {
      setIsTargetCopied((prev) => {
        const updatedTargets = [...prev]
        updatedTargets[index].isCopied = false
        return updatedTargets
      })
    }, 2000)
    await navigator.clipboard.writeText(target.value.toString())
  }

  const handleImageClick = () => {
    setEnlarged((prev) => !prev)
  }

  const handleImageLoaded = () => {
    setisImageLoading(false)
  }

  useEffect(() => {
    if (signal.chartImageHref) {
      setisImageLoading(true)
      setChartHref(signal.chartImageHref)
    }
  }, [signal.chartImageHref])

  return (
    <div className="flex flex-col gap-2 w-full max-w-full overflow-hidden">
      {signal.isPremium && !amISubscribed && publisher.username !== currentUsername ? (
        <div className="relative rounded-lg h-[500px] overflow-hidden">
          <BluredSignalComponent />
          <Link
            to={`/${publisher.username}/premium`}
            className="absolute top-[50%] left-[50%] -translate-x-[50%]
            -translate-y-[50%] action-button text-white bg-gradient-to-r
            dark:from-dark-link-button from-primary-link-button to-[#ff00e5]
            dark:to-[#ff00e5] px-3 py-2 rounded-md"
          >
            Subscribe
          </Link>
        </div>
      ) : (
        <>
          {signal.description && <p className="pt-1 pb-4 break-words">{signal.description}</p>}
          <div className="flex justify-between detail-text">
            <p className="text-lg">{signal.market.name}</p>
            {signal.status === "closed" ? (
              <div className="text-md flex items-center">
                closed
                <RedPulse />
              </div>
            ) : signal.status === "not_opened" ? (
              <div className="text-md flex items-center">
                will be opened {moment(signal.openTime).startOf("seconds").fromNow()}
                <BlackPulse />
              </div>
            ) : (
              <div className="text-md flex items-center">
                will be closed {moment(signal.closeTime).startOf("seconds").fromNow()}
                <GreenPulse />
              </div>
            )}
          </div>
          {isImageLoading && <Loader className="h-[342px]" />}{" "}
          {chartHref && (
            <div
              className={cn(
                "relative w-full h-full rounded mb-4",
                {
                  "fixed inset-0 z-50 flex items-center": enlarged
                },
                { "justify-center bg-black bg-opacity-75": enlarged }
              )}
              onClick={handleImageClick}
            >
              <img
                className={cn(
                  "w-full object-cover cursor-pointer rounded-lg",
                  "transition-opacity duration-300 opacity-100",
                  "h-full md:max-h-[600px] md:object-contain",
                  {
                    "w-[90%] h-auto max-h-[90vh] object-contain": enlarged,
                    "opacity-0 h-0": isImageLoading
                  }
                )}
                src={chartHref}
                alt="Chart"
                onLoad={handleImageLoaded}
                onError={handleImageLoaded}
              />
            </div>
          )}
          <div
            className="bg-white dark:bg-gray-900
            p-4 rounded-lg border border-white/20 w-full"
          >
            <div
              className={cn("flex justify-between md:justify-center text-sm md:text-base", {
                "gap-2 md:gap-12": !isBookmarkPage,
                "gap-2 md:gap-6": isBookmarkPage
              })}
            >
              <div className={`flex items-center ${isBookmarkPage && "text-xs md:text-base"}`}>
                <span className="font-semibold mr-2">Entry:</span>
                <span>{signal.entry}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400 text-sm md:text-base">
                  {marketScale}
                </span>
              </div>
              <div className={`flex items-center ${isBookmarkPage && "text-xs md:text-base"}`}>
                <span className="font-semibold mr-2">Stoploss:</span>
                <span>{signal.stoploss}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400 text-sm md:text-base">
                  {marketScale}
                </span>
              </div>
            </div>
            <ul
              className={`mt-8 flex flex-col gap-6 text-sm md:text-base ${isBookmarkPage && "text-xs md:text-base"}`}
            >
              {signal.targets.map((target, index) => (
                <li className="flex items-center justify-between" key={target.id}>
                  <span className="flex items-center">
                    <span
                      className={`font-semibold mr-0 md:mr-2 inline-block w-[70px] ${isBookmarkPage && "w-[60px] md:w-[70px]"}`}
                    >
                      Target {index + 1}:
                    </span>
                    <span
                      className="bg-gray-600/20 dark:bg-white/20 rounded-md
                      w-fit pl-2 h-fit flex items-center overflow-hidden"
                    >
                      <span>{target.value}</span>
                      <span className="ml-1 text-gray-500 dark:text-gray-400 text-sm md:text-base">
                        {marketScale}
                      </span>
                      <button
                        onClick={() => handleCopyTargetValue(target, index)}
                        className="ml-1 md:ml-2 bg-gray-600/10
                      dark:bg-white/10 h-[36px] px-1 action-button text-sm md:text-base"
                      >
                        <IoMdLink />
                      </button>
                    </span>
                    {isTargetCopied[index].isCopied && (
                      <span
                        className="ml-1 md:ml-2 text-primary-link-button
                      dark:text-dark-link-button"
                      >
                        <FaCheck />
                      </span>
                    )}
                  </span>
                  {signal.status === "closed" &&
                    (target.touched ? (
                      <span
                        className="text-xs md:text-sm text-primary-link-button
                    dark:text-dark-link-button font-bold"
                      >
                        touched
                      </span>
                    ) : (
                      <span
                        className="text-xs md:text-sm text-red-500
                    dark:text-red-500 font-bold"
                      >
                        not touched
                      </span>
                    ))}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
