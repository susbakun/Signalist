import { CryptoResponseType, SignalModel } from '@/shared/models'
import { CoinType } from '@/shared/types'
import { ChangeEvent, useState } from 'react'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'
import { Loader } from '../Shared/Loader'

type CustomDropdownProps = {
  markets: CryptoResponseType['data']['coins']
  selectedMarket: CoinType | undefined
  isLoading: boolean
  isDropDownOpen: boolean
  handleSelectMarket: (market: SignalModel['market']) => void
  handleToggleDropDown: () => void
}

export const CustomDropdown = ({
  markets,
  selectedMarket,
  handleSelectMarket,
  isLoading,
  handleToggleDropDown,
  isDropDownOpen
}: CustomDropdownProps) => {
  const [searchedTerm, setSearchedTerm] = useState('')

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchedTerm(event.target.value)
  }

  const filteredMarkets = markets.filter((market) =>
    market.symbol.toLowerCase().includes(searchedTerm.toLowerCase())
  )

  return (
    <div className="relative w-full">
      <button
        onClick={handleToggleDropDown}
        className="signal-market-selector flex
        items-center justify-between p-2
        bg-gray-200 rounded-md"
      >
        <div className="flex items-center gap-2">
          {selectedMarket && (
            <>
              <img
                className="w-6 h-6 inline-block"
                src={selectedMarket.iconUrl}
                alt={selectedMarket.name}
              />
              <span>{selectedMarket.symbol}USD</span>
            </>
          )}
        </div>
        {isDropDownOpen ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
      </button>
      {isDropDownOpen && (
        <div
          className="absolute z-20 mt-2 w-full
        bg-white border border-gray-600/20
          rounded-lg shadow-lg max-h-60 overflow-y-auto
          dark:bg-gray-600 custom-dropdown
          "
        >
          <div className="px-2 py-2">
            <input
              value={searchedTerm}
              onChange={handleSearch}
              autoFocus
              placeholder="Search for markets"
              className="w-full signal-market-selector"
            />
          </div>
          {!filteredMarkets.length && !isLoading && (
            <div className="p-2 text-center text-gray-500">No markets found</div>
          )}
          {isLoading && <Loader className="h-[80%]" />}
          {filteredMarkets.map((market) => (
            <div
              key={market.uuid}
              className="p-2 flex justify-between items-center
              cursor-pointer dark:hover:bg-gray-500
            hover:bg-gray-300 focus:opacity-85 border-b border-b-gray-600/20 dark:border-b-white/20"
            >
              <div className="flex items-center gap-2">
                <img className="w-6 h-6 inline-block" src={market.iconUrl} alt={market.name} />
                <span>{market.symbol}USD</span>
              </div>
              <button
                onClick={() => handleSelectMarket({ name: market.symbol, uuid: market.uuid })}
                className="text-white transition-all duration-150
                ease-out hover:opacity-60 rounded-lg px-2 py-1
              bg-dark-link-button dark:bg-dark-link-button"
              >
                Select market
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomDropdown
