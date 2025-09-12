import { newsSources } from "@/shared/constants"
import { useState } from "react"
import { CustomSelect } from "../Select/CustomSelect"
import { OptionType } from "@/shared/types"

export const NewsSourcesSelectionBox = () => {
  const [selectedSource, setSelectedSource] = useState<string>("CoinDesk")

  const handleSourceChange = (source: OptionType | null) => {
    setSelectedSource(source ? source.value : "")
  }

  return (
    <div
      className="flex flex-col gap-4 rounded-md bg-white p-4
            dark:bg-gray-800 w-full"
    >
      <h4 className="text-xl font-bold">Sources</h4>
      <CustomSelect options={newsSources} selected={selectedSource} onChange={handleSourceChange} />
    </div>
  )
}
