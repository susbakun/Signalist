import { CryptoPreview, Loader, MarketSelectionDrawer } from "@/components"
import { EmptyPage } from "@/pages"
import { useGetCryptosQuery } from "@/services/cryptoApi"
import { STORAGE_KEYS } from "@/shared/constants"
import { CryptoResponseType } from "@/shared/models"
import { CoinType } from "@/shared/types"
import { getCurrentUsername } from "@/utils"
import { Table } from "flowbite-react"
import { isEmpty } from "lodash"
import { useEffect, useState } from "react"
import { IoAddCircleOutline } from "react-icons/io5"

export const WatchList = () => {
  const { data: cryptosList, isLoading } = useGetCryptosQuery(50)
  const [cryptos, setCryptos] = useState<CryptoResponseType["data"]["coins"]>([])
  const [isOpen, setIsOpen] = useState(false)
  const username = getCurrentUsername()

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
      console.log(cryptosList.data.coins)
    } else if (cryptosList?.data?.coins) {
      // If no saved watchlist, use default from API
      setCryptos([])
      saveWatchlist(username, [])
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
      )}
    </section>
  )
}
