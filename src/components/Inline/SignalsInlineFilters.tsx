import { useEffect, useMemo, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { CustomSelect } from "@/components/Select/CustomSelect"
import { useGetWallexMarketsQuery } from "@/services/cryptoApi"
import { transformWallexData } from "@/utils"
import { OptionType, SignalsFilters } from "@/shared/types"
import { SignalModel } from "@/shared/models"
import "@/components/Modal/CreateSignal/date-picker.css"
import { signalStatus } from "@/shared/constants"

type SignalsInlineFiltersProps = {
  isOpen: boolean
  value: SignalsFilters
  onChange: (filters: SignalsFilters) => void
  onClose?: () => void
}

export const SignalsInlineFilters = ({
  isOpen,
  value,
  onChange,
  onClose
}: SignalsInlineFiltersProps) => {
  const [local, setLocal] = useState<SignalsFilters>(value)
  const { data: wallexResponse } = useGetWallexMarketsQuery()

  useEffect(() => setLocal(value), [value])

  const marketOptions: OptionType[] = useMemo(() => {
    const transformed = transformWallexData(wallexResponse?.data)
    // Only include USDT pairs to match signal markets
    const usdtPairs = transformed.filter((c) => c.quoteAsset === "USDT")
    return usdtPairs.map((c) => ({ value: `${c.symbol}/USDT`, label: `${c.symbol}/USDT` }))
  }, [wallexResponse])

  const setPreset = (preset: "today" | "week" | "month") => {
    const now = new Date()
    let from = new Date(now)
    let until = new Date(now)

    if (preset === "today") {
      from.setHours(0, 0, 0, 0)
      until.setHours(23, 59, 59, 999)
    } else if (preset === "week") {
      // Start week on Monday
      const day = now.getDay() // 0 Sun .. 6 Sat
      const diffToMonday = (day + 6) % 7
      from = new Date(now)
      from.setDate(now.getDate() - diffToMonday)
      from.setHours(0, 0, 0, 0)

      until = new Date(from)
      until.setDate(from.getDate() + 6)
      until.setHours(23, 59, 59, 999)
    } else if (preset === "month") {
      from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
      until = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    }

    setLocal((p) => ({ ...p, openFrom: from.getTime(), closeTo: until.getTime() }))
  }

  const apply = () => {
    onChange(local)
    onClose?.()
  }

  const reset = () => {
    const cleared: SignalsFilters = {
      market: undefined,
      openFrom: null,
      openTo: null,
      closeFrom: null,
      closeTo: null,
      status: ""
    }
    setLocal(cleared)
    onChange(cleared)
  }

  if (!isOpen) return null

  return (
    <div
      className="mx-4 mt-4 mb-2 rounded-xl border border-gray-600/20
     dark:border-white/20 bg-gray-300/40 dark:bg-gray-700/30 p-3 md:p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 md:col-span-2">
          <h3 className="font-semibold">Quick presets</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              className="dark:bg-gray-600 bg-gray-300 px-4 py-2 rounded-lg action-button"
              onClick={() => setPreset("today")}
            >
              Today
            </button>
            <button
              className="dark:bg-gray-600 bg-gray-300 px-4 py-2 rounded-lg action-button"
              onClick={() => setPreset("week")}
            >
              This week
            </button>
            <button
              className="dark:bg-gray-600 bg-gray-300 px-4 py-2 rounded-lg action-button"
              onClick={() => setPreset("month")}
            >
              This month
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Market</h3>
          <div className="min-w-[220px]">
            <CustomSelect
              options={marketOptions}
              selected={local.market || ""}
              onChange={(opt) => setLocal((p) => ({ ...p, market: opt?.value || undefined }))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Status</h3>
          <div className="flex gap-2 flex-wrap">
            {signalStatus.map((s) => (
              <button
                key={s.key}
                className={`dark:bg-gray-600 bg-gray-300 px-4 py-2 rounded-lg action-button
                     ${local.status === s.key ? "ring-2 ring-blue-400" : ""}`}
                onClick={() =>
                  setLocal((p) => ({ ...p, status: s.key as SignalModel["status"] | "" }))
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">From</h3>
          <div className="flex gap-2">
            <DatePicker
              selected={local.openFrom ? new Date(local.openFrom) : null}
              onChange={(d) => setLocal((p) => ({ ...p, openFrom: d ? d.getTime() : null }))}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="From"
              className="signal-market-selector w-full"
              popperPlacement="bottom-start"
              popperModifiers={[
                {
                  name: "preventOverflow",
                  options: { boundary: "viewport", padding: 20 },
                  fn: ({ x, y }) => ({ x, y })
                }
              ]}
              popperClassName="custom-datepicker-popper"
              portalId="root"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Until</h3>
          <div className="flex gap-2">
            <DatePicker
              selected={local.closeTo ? new Date(local.closeTo) : null}
              onChange={(d) => setLocal((p) => ({ ...p, closeTo: d ? d.getTime() : null }))}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="To"
              className="signal-market-selector w-full"
              minDate={local.openFrom ? new Date(local.openFrom) : undefined}
              popperPlacement="bottom-start"
              popperModifiers={[
                {
                  name: "preventOverflow",
                  options: { boundary: "viewport", padding: 20 },
                  fn: ({ x, y }) => ({ x, y })
                }
              ]}
              popperClassName="custom-datepicker-popper"
              portalId="root"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="dark:bg-gray-600 bg-gray-300 px-4 py-2
          rounded-lg action-button"
          onClick={reset}
        >
          Reset
        </button>
        <button className="main-button px-4 py-2 rounded-md" onClick={apply}>
          Apply Filters
        </button>
      </div>
    </div>
  )
}
