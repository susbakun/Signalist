import { CustomSelect } from "../Select/CustomSelect"
import { cryptoNewsCategories } from "@/shared/constants"
import { OptionType } from "@/shared/types"
import { useState } from "react"

export const NewsMarketSelectionBox = () => {
  const [currency, setCurrency] = useState<string>("BTC")

  const changeCryptoCurrency = (selected: OptionType | null) => {
    setCurrency(selected ? selected.value : "")
  }

  return (
    <div
      className="flex flex-col gap-4 rounded-md bg-white p-4
            dark:bg-gray-800 w-full"
    >
      <h4 className="text-xl font-bold">Markets</h4>
      <CustomSelect
        options={cryptoNewsCategories}
        selected={currency}
        onChange={changeCryptoCurrency}
      />
    </div>
  )
}
