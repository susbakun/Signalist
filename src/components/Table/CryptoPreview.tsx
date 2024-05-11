import { CoinType } from '@/shared/types'
import { cn } from '@/utils'
import { TableCell, TableRow } from 'flowbite-react'
import millify from 'millify'
import { ComponentProps, useState } from 'react'
import { IoTrashOutline } from 'react-icons/io5'

type CryptoPreviewProps = ComponentProps<'div'> &
  CoinType & {
    removeMarket: (uuid: CoinType['uuid']) => void
  }

export const CryptoPreview = ({
  name,
  price,
  uuid,
  change,
  symbol,
  iconUrl,
  removeMarket,

  '24hVolume': volume
}: CryptoPreviewProps) => {
  const [isMouseEnter, setIsMouseEnter] = useState(false)

  const handleMouseEnter = () => {
    setIsMouseEnter(true)
  }

  const handleMouseLeave = () => {
    setIsMouseEnter(false)
  }

  return (
    <TableRow
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      key={uuid}
      className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
    >
      <TableCell className="whitespace-nowrap font-medium text-slate-700 dark:text-white">
        <div className="flex items-center gap-[6px] justify-center">
          <img className="w-6 h-6 inline-block" src={iconUrl} alt={name} />{' '}
          <div className="flex gap-[2px]">
            <span>{symbol}</span>
            <span className="detail-text">/USD</span>
          </div>
        </div>
      </TableCell>

      <TableCell className="font-bold text-md text-gray-700/90 dark:text-white/70">
        {(+price).toLocaleString('en-Us')}$
      </TableCell>
      <TableCell className="text-gray-600 dark:text-white/60">{millify(+volume)}</TableCell>
      <TableCell className="flex justify-center">
        <img src={`https://nobitex.ir/nobitex-cdn/charts/${symbol.toLowerCase()}.svg`} alt={name} />
      </TableCell>
      <TableCell className={+change > 0 ? 'text-dark-link-button' : 'text-rose-500'}>
        {millify(+change)}%
      </TableCell>
      <TableCell>
        <button onClick={() => removeMarket(uuid)}>
          <IoTrashOutline
            className={cn('w-5 h-5 action-button opacity-0', {
              'opacity-100': isMouseEnter
            })}
          />
        </button>
      </TableCell>
    </TableRow>
  )
}
