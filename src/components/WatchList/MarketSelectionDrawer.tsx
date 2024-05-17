import { SelectionTable } from '@/components'
import { EmptyPage } from '@/pages'
import { useGetCryptosQuery } from '@/services/cryptoApi'
import { CryptoResponseType } from '@/shared/models'
import { CoinType } from '@/shared/types'
import { Drawer } from 'flowbite-react'
import { ChangeEvent, useEffect, useState } from 'react'
import { FaChartLine } from 'react-icons/fa'

type MarketSelectionDrawerProps = {
  isOpen: boolean
  selectedCryptos: CryptoResponseType['data']['coins']
  closeDrawer: () => void
  selectMarket: (coin: CoinType) => void
}

export const MarketSelectionDrawer = ({
  isOpen,
  selectedCryptos,
  closeDrawer,
  selectMarket
}: MarketSelectionDrawerProps) => {
  const [drawerCoins, setDrawerCoins] = useState<CryptoResponseType['data']['coins']>([])
  const [searchTerm, setSearchTerm] = useState('')

  const { data: cryptosList } = useGetCryptosQuery(20)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    if (cryptosList?.data.coins) {
      const filteredData = cryptosList?.data?.coins.filter((coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setDrawerCoins(filteredData)
    }
  }, [cryptosList, searchTerm])

  const notSelectedMarkets = drawerCoins.filter((drawerCoin) => {
    if (selectedCryptos.every((selectedCoin) => selectedCoin.name !== drawerCoin.name)) {
      return drawerCoin
    }
  })

  return (
    <Drawer
      className="w-[400px] custom-drawer"
      open={isOpen}
      onClose={closeDrawer}
      position="right"
    >
      <Drawer.Header titleIcon={FaChartLine} title="Markets" />
      <Drawer.Items>
        <div className="px-4 mb-4">
          <input
            value={searchTerm}
            autoFocus
            onChange={handleSearch}
            className="custom-input inline-block"
            placeholder="Search"
          />
        </div>
        {!notSelectedMarkets.length ? (
          <EmptyPage className="flex justify-center items-center h-[80vh]">
            <h3>No markets found!</h3>
          </EmptyPage>
        ) : (
          <SelectionTable selectMarket={selectMarket} notSelectedMarkets={notSelectedMarkets} />
        )}
      </Drawer.Items>
    </Drawer>
  )
}
