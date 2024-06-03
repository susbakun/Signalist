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

  const handleRemoveFromWatchList = (coinId: CoinType['uuid']) => {
    const filteredCryptos = cryptos.filter((crypto) => crypto.uuid !== coinId)
    setCrytops(filteredCryptos)
  }

  useEffect(() => {
    if (cryptosList?.data.coins) {
      setCrytops(cryptosList.data.coins)
    }
  }, [cryptosList])

  if (!cryptos?.length || isLoading)
    return (
      <>
        <h4 className="text-xl">WatchList</h4>
        <Loader className="h-[80vh]" />
      </>
    )

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
            <Table.HeadCell className="text-center">Market</Table.HeadCell>
            <Table.HeadCell className="text-center">Current Price</Table.HeadCell>
            <Table.HeadCell className="text-center">24h Volume</Table.HeadCell>
            <Table.HeadCell className="text-center">Weekly Chart</Table.HeadCell>
            <Table.HeadCell className="text-center">24h Change</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Select</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {cryptos.map((crypto) => (
              <CryptoPreview
                removeMarket={handleRemoveFromWatchList}
                {...crypto}
                key={crypto.uuid}
              />
            ))}
          </Table.Body>
        </Table>
      </div>
    </section>
  )
}
