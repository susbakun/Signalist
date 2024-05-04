import { CryptoPreview, Loader, MarketSelectionDrawer } from '@/components'
import { useGetCryptosQuery } from '@/services/cryptoApi'
import { CryptoResponseType } from '@/shared/models'
import { CoinType } from '@/shared/types'
import { Table } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { IoAddCircleOutline } from 'react-icons/io5'

export const WatchList = () => {
  const { data: cryptosList, isLoading } = useGetCryptosQuery(
    5
    // { pollingInterval: 3000 }
  )
  const [cryptos, setCrytops] = useState<CryptoResponseType['data']['coins']>([])
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => setIsOpen(false)
  const handleOpen = () => setIsOpen(true)

  const handleSelectMarket = (coin: CoinType) => {
    setCrytops((prev) => [...prev, coin])
  }

  useEffect(() => {
    if (cryptosList?.data.coins) {
      setCrytops(cryptosList.data.coins)
    }
  }, [cryptosList])

  if (!cryptos?.length || isLoading) return <Loader className="h-[80vh]" />
  return (
    <section>
      <div className="flex justify-between px-2 mb-4">
        <h4 className="text-xl">WatchList</h4>
        <button onClick={handleOpen} className="action-button">
          <IoAddCircleOutline className="w-6 h-6" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <MarketSelectionDrawer
          selectedCryptos={cryptos}
          isOpen={isOpen}
          closeDrawer={handleClose}
          selectMarket={handleSelectMarket}
        />
        <Table>
          <Table.Head>
            <Table.HeadCell>Market</Table.HeadCell>
            <Table.HeadCell>Current Price</Table.HeadCell>
            <Table.HeadCell>24h Volume</Table.HeadCell>
            <Table.HeadCell>Weekly Chart</Table.HeadCell>
            <Table.HeadCell>24h Change</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {cryptos.map((crypto) => (
              <Table.Row
                key={crypto.uuid}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <CryptoPreview {...crypto} key={crypto.uuid} />
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </section>
  )
}
