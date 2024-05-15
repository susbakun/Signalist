import { SignalModel } from '@/shared/models'
import { getFormattedMarketName, getMarketScale } from '@/utils'
import moment from 'jalali-moment'
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets'
import { BlackPulse, GreenPulse, RedPulse } from './Pulse'
import { SignalTopBar } from './SignalTopBar'

type SignalProps = {
  signal: SignalModel
}

export const Signal = ({ signal }: SignalProps) => {
  const { publisher } = signal
  const marketName = getFormattedMarketName(signal.market)
  const marketScale = getMarketScale(signal.market)

  return (
    <div
      className="flex flex-col gap-8 px-4 py-6 border-b
    border-b-gray-600/20 dark:border-b-white/20"
    >
      <SignalTopBar publisher={publisher} date={signal.date} signalId={signal.id} />
      {/* <MiniChart colorTheme="dark" width="100%" symbol={'BTCUSD'}></MiniChart> */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between detail-text">
          <p className="text-lg">{signal.market}</p>
          {signal.status === 'closed' ? (
            <p className="text-md flex items-center">
              closed
              <RedPulse />
            </p>
          ) : signal.status === 'not_opened' ? (
            <p className="text-md flex items-center">
              will be opened {moment(signal.openTime).startOf('seconds').fromNow()}
              <BlackPulse />
            </p>
          ) : (
            <p className="text-md flex items-center">
              will be colsed {moment(signal.closeTime).startOf('seconds').fromNow()}
              <GreenPulse />
            </p>
          )}
        </div>
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
        <div
          className="flex flex-col gap-4 border-2
          rounded-lg border-white/20 px-4 py-2"
        >
          <div>
            Entry: {signal.entry} <span className="detail-text">{marketScale}</span>
          </div>
          <div>
            Stoploss: {signal.stoploss} <span className="detail-text">{marketScale}</span>
          </div>
          <ul className="flex flex-col gap-4 justify-center">
            {signal.targets.map((target, index) => (
              <li className="flex items-center" key={index}>
                <span className="w-52">
                  target {index + 1}: {target.value}{' '}
                  <span className="detail-text">{marketScale}</span>
                </span>
                {target.touched && <span className="text-dark-link-button">touched</span>}
              </li>
            ))}
          </ul>
        </div>
        {signal.description && <p className="pt-4">{signal.description}</p>}
      </div>
    </div>
  )
}
