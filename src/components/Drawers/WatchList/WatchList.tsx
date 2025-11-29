import { CryptoPreview, Loader, MarketSelectionDrawer } from "@/components"
import { EmptyPage } from "@/pages"
import { useGetWallexMarketsQuery } from "@/services/cryptoApi"
import { STORAGE_KEYS } from "@/shared/constants"
import { CoinType } from "@/shared/types"
import { getCurrentUsername, getWeeklyChartUrl, transformWallexData } from "@/utils"
import { Table } from "flowbite-react"
import { isEmpty } from "lodash"
import millify from "millify"
import { useEffect, useMemo, useState } from "react"
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5"

export const WatchList = () => {
  // Use the new Wallex API instead of the CoinRanking API
  // const { data: cryptosList, isLoading } = useGetCryptosQuery(50)
  const { data: wallexResponse, isLoading } = useGetWallexMarketsQuery()
  const [cryptos, setCryptos] = useState<CoinType[]>([])
  const [isOpen, setIsOpen] = useState(false)


  // Memoize username so it doesn't change on every render
  const username = useMemo(() => getCurrentUsername(), [])

  // Memoize transformed data to prevent unnecessary recalculations
  const cryptosList = useMemo(() => {
    if (!wallexResponse?.data) return null
    return {
      data: {
        coins: transformWallexData(wallexResponse.data)
      }
    }
  }, [wallexResponse])


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
    setCryptos((prevCryptos) => {
      const newList = [...prevCryptos, coin]
      saveWatchlist(
        username,
        newList.map((c) => c.uuid)
      )
      return newList
    })
  }

  const handleRemoveFromWatchList = (coinId: CoinType["uuid"]) => {
    setCryptos((prevCryptos) => {
      const filteredCryptos = prevCryptos.filter((crypto) => crypto.uuid !== coinId)
      saveWatchlist(
        username,
        filteredCryptos.map((c) => c.uuid)
      )
      return filteredCryptos
    })
  }

  // Load the watchlist once when data is available
  useEffect(() => {
    if (!cryptosList?.data?.coins || !username) return

    // Load saved watchlist
    const savedWatchlist = loadWatchlist(username)

    if (savedWatchlist.length > 0) {
      // Find matching coins from the API data
      const matchedCoins = savedWatchlist
        .map((id) => cryptosList.data.coins.find((c) => c.uuid === id))
        .filter((coin) => coin !== undefined) as CoinType[]

      if (matchedCoins.length > 0) {
        setCryptos(matchedCoins)
      } else {
        // If no matches found, use defaults
        const usdtPairs = cryptosList.data.coins.filter((coin) => coin.quoteAsset === "USDT")
        const defaultCoins = usdtPairs.slice(0, 5)
        setCryptos(defaultCoins)
        saveWatchlist(
          username,
          defaultCoins.map((c) => c.uuid)
        )
      }
    } else {
      // No saved watchlist, use defaults
      const usdtPairs = cryptosList.data.coins.filter((coin) => coin.quoteAsset === "USDT")
      const defaultCoins = usdtPairs.slice(0, 5)
      setCryptos(defaultCoins)
      saveWatchlist(
        username,
        defaultCoins.map((c) => c.uuid)
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
                      src={getWeeklyChartUrl(crypto.symbol)}
                      alt={crypto.name}
                      className="hue-rotate-15 saturate-150 brightness-110"
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
