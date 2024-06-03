import { BlackPulse, BluredSignalComponent, GreenPulse, RedPulse } from '@/components'
import { SignalModel } from '@/shared/models'
import { getFormattedMarketName, getMarketScale, isDarkMode } from '@/utils'
import moment from 'jalali-moment'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { IoMdLink } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets'

type SignalContextProps = {
  signal: SignalModel
  simplified?: boolean
}

type IsTargetCopiedType = {
  id: string
  isCopied: boolean
}[]

export const SignalContext = ({ signal, simplified }: SignalContextProps) => {
  const [isTargetCopied, setIsTargetCopied] = useState<IsTargetCopiedType>(() => {
    return signal.targets.map((target) => ({ id: target.id, isCopied: false }))
  })

  const { publisher } = signal

  const marketName = getFormattedMarketName(signal.market.name)
  const marketScale = getMarketScale(signal.market.name)

  const handleCopyTargetValue = async (target: SignalModel['targets'][0], index: number) => {
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

  return (
    <div className="flex flex-col gap-2">
      {signal.isPremium && !signal.subscribed ? (
        <div className="relative rounded-lg h-[500px] overflow-x-hidden overflow-y-hidden">
          <BluredSignalComponent />

          <Link
            to={`${publisher.username}`}
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
          {signal.description && <p className="pt-1 pb-4">{signal.description}</p>}
          <div className="flex justify-between detail-text">
            <p className="text-lg">{signal.market.name}</p>
            {signal.status === 'closed' ? (
              <div className="text-md flex items-center">
                closed
                <RedPulse />
              </div>
            ) : signal.status === 'not_opened' ? (
              <div className="text-md flex items-center">
                will be opened {moment(signal.openTime).startOf('seconds').fromNow()}
                <BlackPulse />
              </div>
            ) : (
              <div className="text-md flex items-center">
                will be colsed {moment(signal.closeTime).startOf('seconds').fromNow()}
                <GreenPulse />
              </div>
            )}
          </div>
          {signal.showChart && (
            <AdvancedRealTimeChart
              theme={isDarkMode() ? 'dark' : 'light'}
              width="100%"
              symbol={marketName}
              height={simplified ? 400 : 500}
              hotlist={false}
              style="3"
              hide_legend
              hide_side_toolbar
              allow_symbol_change={false}
              range="1D"
              timezone="Asia/Tehran"
            ></AdvancedRealTimeChart>
          )}
          <div
            className="bg-white dark:bg-gray-900
          p-4 rounded-lg border-2 border-white/20"
          >
            <div className="flex justify-center gap-10">
              <div className="flex items-center">
                <span className="font-semibold mr-2">Entry:</span>
                <span>{signal.entry}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">{marketScale}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">Stoploss:</span>
                <span>{signal.stoploss}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">{marketScale}</span>
              </div>
            </div>
            <ul className="mt-8 flex flex-col gap-6">
              {signal.targets.map((target, index) => (
                <li className="flex items-center justify-between" key={target.id}>
                  <span className="flex items-center">
                    <span className="font-semibold mr-2 inline-block w-[70px]">
                      Target {index + 1}:
                    </span>
                    <span
                      className="bg-gray-600/20 dark:bg-white/20 rounded-md
                    w-fit pl-2 h-fit flex items-center overflow-y-hidden"
                    >
                      <span>{target.value}</span>
                      <span className="ml-1 text-gray-500 dark:text-gray-400">{marketScale}</span>
                      <button
                        onClick={() => handleCopyTargetValue(target, index)}
                        className="ml-2 bg-gray-600/10
                      dark:bg-white/10 h-[36px] px-1 action-button"
                      >
                        <IoMdLink />
                      </button>
                    </span>
                    {isTargetCopied[index].isCopied && (
                      <span
                        className="ml-2 text-primary-link-button
                      dark:text-dark-link-button"
                      >
                        <FaCheck />
                      </span>
                    )}
                  </span>
                  {signal.status === 'closed' &&
                    (target.touched ? (
                      <span
                        className="text-sm text-primary-link-button
                    dark:text-dark-link-button font-bold"
                      >
                        touched
                      </span>
                    ) : (
                      <span
                        className="text-sm text-red-500
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
