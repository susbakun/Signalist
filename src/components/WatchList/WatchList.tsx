import { CryptoPreview, Loader, MarketSelectionDrawer } from "@/components"
import { EmptyPage } from "@/pages"
import { useGetWallexMarketsQuery } from "@/services/cryptoApi"
import { STORAGE_KEYS } from "@/shared/constants"
import { CoinType } from "@/shared/types"
import { getCurrentUsername, transformWallexData } from "@/utils"
import { Table } from "flowbite-react"
import { isEmpty } from "lodash"
import { useEffect, useState, useMemo } from "react"
import { IoAddCircleOutline } from "react-icons/io5"

export const WatchList = () => {
  // Use the new Wallex API instead of the CoinRanking API
  // const { data: cryptosList, isLoading } = useGetCryptosQuery(50)
  const { data: wallexData, isLoading } = useGetWallexMarketsQuery()
  const [cryptos, setCryptos] = useState<CoinType[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Memoize username so it doesn't change on every render
  const username = useMemo(() => getCurrentUsername(), [])

  // Memoize transformed data to prevent unnecessary recalculations
  const cryptosList = useMemo(() => {
    if (!wallexData) return null
    return {
      data: {
        coins: transformWallexData(wallexData)
      }
    }
  }, [wallexData])

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
        </div>
      )}
    </section>
  )
}
