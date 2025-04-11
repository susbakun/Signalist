import { SelectionTable } from "@/components"
import { EmptyPage } from "@/pages"
import { useGetWallexMarketsQuery } from "@/services/cryptoApi"
import { CoinType } from "@/shared/types"
import { transformWallexData } from "@/utils"
import { Drawer } from "flowbite-react"
import { ChangeEvent, useEffect, useState } from "react"
import { FaChartLine } from "react-icons/fa"

type MarketSelectionDrawerProps = {
  isOpen: boolean
  selectedCryptos: CoinType[]
  closeDrawer: () => void
  selectMarket: (coin: CoinType) => void
}

export const MarketSelectionDrawer = ({
  isOpen,
  selectedCryptos,
  closeDrawer,
  selectMarket
}: MarketSelectionDrawerProps) => {
  const [drawerCoins, setDrawerCoins] = useState<CoinType[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const { data: wallexData } = useGetWallexMarketsQuery()

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    if (wallexData) {
      const transformedCoins = transformWallexData(wallexData)
      const filteredData = transformedCoins.filter(
        (coin) =>
          (coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())) &&
          coin.quoteAsset !== "TMN"
      )
      console.log(filteredData)
      setDrawerCoins(filteredData)
    }
  }, [wallexData, searchTerm])

  const notSelectedMarkets = drawerCoins.filter((drawerCoin) => {
    return selectedCryptos.every((selectedCoin) => selectedCoin.uuid !== drawerCoin.uuid)
  })

  return (
    <Drawer
      className="w-full sm:w-[420px] custom-drawer"
      open={isOpen}
      onClose={closeDrawer}
      position="right"
    >
      <Drawer.Header titleIcon={FaChartLine} title="Markets" />
      <Drawer.Items>
        <div className="px-2 sm:px-4 mb-4">
          <input
            value={searchTerm}
            autoFocus
            onChange={handleSearch}
            className="custom-input w-full pl-2 sm:pl-4 inline-block text-sm sm:text-base py-2"
            placeholder="Search"
          />
        </div>
        {!notSelectedMarkets.length ? (
          <EmptyPage className="flex justify-center items-center h-[60vh] sm:h-[80vh]">
            <h3 className="font-normal text-sm sm:text-base">No markets found!</h3>
          </EmptyPage>
        ) : (
          <div className="md:px-2 px-0">
            <SelectionTable selectMarket={selectMarket} notSelectedMarkets={notSelectedMarkets} />
          </div>
        )}
      </Drawer.Items>
    </Drawer>
  )
}
