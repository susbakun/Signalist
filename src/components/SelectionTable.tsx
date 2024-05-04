import { CryptoResponseType } from '@/shared/models'
import { CoinType } from '@/shared/types'
import { Table } from 'flowbite-react'

type SelctionTableProps = {
  notSelectedMarkets: CryptoResponseType['data']['coins']
  selectMarket: (coin: CoinType) => void
}

export const SelectionTable = ({ notSelectedMarkets, selectMarket }: SelctionTableProps) => {
  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>
          <span className="sr-only"></span>
        </Table.HeadCell>
        <Table.HeadCell>Market</Table.HeadCell>
        <Table.HeadCell>
          <span className="sr-only">Select</span>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {notSelectedMarkets.map((crypto, index) => (
          <Table.Row key={crypto.uuid} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-slate-700 dark:text-white">
              <div className="flex items-center gap-[6px]">
                <img className="w-6 h-6 inline-block" src={crypto.iconUrl} alt={crypto.name} />{' '}
                <div className="flex gap-[2px]">
                  <span>{crypto.symbol}</span>
                  <span className="detail-text">/USD</span>
                </div>
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-slate-700 dark:text-white">
              <button
                className="text-white transition-all duration-150 ease-out hover:opacity-60 rounded-lg 
                    px-2 py-1 bg-dark-link-button
                   dark:bg-dark-link-button"
                onClick={() => selectMarket(crypto)}
              >
                Add Market
              </button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
