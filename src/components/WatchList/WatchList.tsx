import { CryptoPreview, Loader, MarketSelectionDrawer } from "@/components"
import { EmptyPage } from "@/pages"
import { useGetWallexMarketsQuery } from "@/services/cryptoApi"
import { nobitexMarketChart, STORAGE_KEYS } from "@/shared/constants"
import { CoinType } from "@/shared/types"
import { getCurrentUsername, transformWallexData } from "@/utils"
import { Table } from "flowbite-react"
import { isEmpty } from "lodash"
import { millify } from "millify"
import { useEffect, useState } from "react"
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5"

export const WatchList = () => {
  // Use the new Wallex API instead of the CoinRanking API
  // const { data: cryptosList, isLoading } = useGetCryptosQuery(50)
  const { data: wallexData, isLoading } = useGetWallexMarketsQuery()
  const [cryptos, setCryptos] = useState<CoinType[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const username = getCurrentUsername()

  // Transform Wallex data to the format expected by components
  const cryptosList = wallexData
    ? {
        data: {
          coins: transformWallexData(wallexData)
        }
      }
    : null

  const saveWatchlist = (username: string, watchlist: string[]) => {
    const key = `${STORAGE_KEYS.WATCHLIST}_${username}`
    localStorage.setItem(key, JSON.stringify(watchlist))
  }

  const loadWatchlist = (username: string): string[] => {
    const key = `${STORAGE_KEYS.WATCHLIST}_${username}`
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : []
  }

  const handleClose = () => setIsOpen(false)
  const handleOpen = () => setIsOpen(true)

  const handleSelectMarket = (coin: CoinType) => {
    const newList = [...cryptos, coin]
    setCryptos(newList)
    saveWatchlist(
      username,
      newList.map((c) => c.uuid)
    )
  }

  const handleRemoveFromWatchList = (coinId: CoinType["uuid"]) => {
    const filteredCryptos = cryptos.filter((crypto) => crypto.uuid !== coinId)
    setCryptos(filteredCryptos)
    saveWatchlist(
      username,
      filteredCryptos.map((c) => c.uuid)
    )
  }

  useEffect(() => {
    // First try to load saved watchlist
    const savedWatchlist = loadWatchlist(username)
    if (savedWatchlist.length > 0 && cryptosList?.data?.coins) {
      setCryptos(
        savedWatchlist.map(
          (id) => cryptosList.data.coins.find((c) => c.uuid === id) || ({ uuid: id } as CoinType)
        )
      )
    } else if (cryptosList?.data?.coins) {
      // If no saved watchlist, use default from API (filter to only USDT pairs if desired)
      const usdtPairs = cryptosList.data.coins.filter((coin) => coin.quoteAsset === "USDT")
      setCryptos(usdtPairs.slice(0, 5)) // Start with top 5 USDT pairs
      saveWatchlist(
        username,
        usdtPairs.slice(0, 5).map((c) => c.uuid)
      )
    }
  }, [cryptosList, username])

  if (isLoading)
    return (
      <>
        <h4 className="text-xl">WatchList</h4>
        <Loader className="h-[50vh]" />
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

      {/* Move MarketSelectionDrawer here, so it's always present */}
      <MarketSelectionDrawer
        selectedCryptos={cryptos}
        isOpen={isOpen}
        closeDrawer={handleClose}
        selectMarket={handleSelectMarket}
      />

      {isEmpty(cryptos) ? (
        <EmptyPage className="flex justify-center font-medium">
          <h3>Your watchlist is empty</h3>
        </EmptyPage>
      ) : (
        <div className="overflow-x-auto">
          <Table className="hidden md:table">
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
          <div className="md:hidden grid grid-cols-2 gap-4">
            {cryptos.map((crypto) => (
              <div key={crypto.uuid} className="bg-white dark:bg-gray-800 p-4 rounded-md">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <img className="w-6 h-6" src={crypto.iconUrl} alt={crypto.name} />
                    <span className="text-sm truncate max-w-[80px]">
                      {crypto.symbol}/{crypto.quoteAsset || "USD"}
                    </span>
                  </div>
                  <button onClick={() => handleRemoveFromWatchList(crypto.uuid)} className="ml-2">
                    <IoTrashOutline className="w-5 h-5 text-red-500" />
                  </button>
                </div>
                <div className="mt-2">
                  <p>Price: ${(+crypto.price).toLocaleString("en-Us")}</p>
                  <p>Volume: {millify(+crypto["24hVolume"])}</p>
                  <p className={+crypto.change > 0 ? "text-green-500" : "text-red-500"}>
                    Change: {millify(+crypto.change)}%
                  </p>
                  <div className="flex justify-center mt-2">
                    <img
                      src={`${nobitexMarketChart}${crypto.symbol.toLowerCase()}.svg`}
                      alt={crypto.name}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
