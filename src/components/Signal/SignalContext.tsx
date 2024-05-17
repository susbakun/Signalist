import { BlackPulse, GreenPulse, RedPulse } from '@/components'
import { SignalModel } from '@/shared/models'
import { getFormattedMarketName, getMarketScale } from '@/utils'
import moment from 'jalali-moment'
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets'

type SignalContextProps = {
  signal: SignalModel
}

export const SignalContext = ({ signal }: SignalContextProps) => {
  const marketName = getFormattedMarketName(signal.market)
  const marketScale = getMarketScale(signal.market)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between detail-text">
        <p className="text-lg">{signal.market}</p>
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
          theme="dark"
          width="100%"
          symbol={marketName}
          height={500}
          hotlist={false}
          style="3"
          hide_legend
          hide_side_toolbar
          allow_symbol_change={false}
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
        <ul className="mt-8 flex flex-col gap-4">
          {signal.targets.map((target, index) => (
            <li className="flex items-center justify-between" key={index}>
              <span>
                <span className="font-semibold mr-1">Target {index + 1}:</span>
                <span>{target.value}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">{marketScale}</span>
              </span>
              {signal.status === 'closed' &&
                (target.touched ? (
                  <span
                    className="text-sm text-primary-link-button
                    dark:text-dark-link-button"
                  >
                    touched
                  </span>
                ) : (
                  <span
                    className="text-sm text-red-500
                    dark:text-red-500"
                  >
                    not touched
                  </span>
                ))}
            </li>
          ))}
        </ul>
      </div>
      {signal.description && <p className="pt-4">{signal.description}</p>}
    </div>
  )
}
