import { Popover } from "react-tiny-popover"
import { useMemo, useState } from "react"
import type { SignalModel } from "@/shared/models"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

type ScoreDetailsPopoverProps = {
  userScore: number
  signalsCount: number
  userPage?: boolean
  signals: Pick<SignalModel, "date" | "score">[]
  position?: "bottom" | "right"
}

export const ScoreDetailsPopover = ({
  userScore,
  signalsCount,
  userPage = false,
  position = "bottom",
  signals
}: ScoreDetailsPopoverProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const userStatus = (avgScore: number) => {
    if (avgScore >= 0.15) return "Very Well"
    else if (avgScore >= 0.07 && avgScore < 0.15) return "Good"
    else if (avgScore >= 0.01 && avgScore < 0.07) return "Medium"
    else if (avgScore >= -0.05 && avgScore < 0.01) return "Weak"
    else return "Risky"
  }

  const chartData = useMemo(() => {
    if (!signals || signals.length === 0) return [] as { time: string; score: number }[]

    // Aggregate by month/year and sum scores
    const buckets = new Map<number, { label: string; score: number }>()
    for (const s of signals) {
      if (typeof s.date !== "number") continue
      const d = new Date(s.date)
      const year = d.getFullYear()
      const month = d.getMonth() // 0-11
      const ts = new Date(year, month, 1).getTime()
      const label = d.toLocaleString(undefined, { month: "short", year: "numeric" })
      const prev = buckets.get(ts)
      const scoreToAdd = typeof s.score === "number" ? s.score : 0
      if (prev) {
        prev.score += scoreToAdd
      } else {
        buckets.set(ts, { label, score: scoreToAdd })
      }
    }

    return Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, v]) => ({ time: v.label, score: v.score.toFixed(2) }))
  }, [signals])

  return (
    <Popover
      positions={position}
      isOpen={isPopoverOpen}
      aria-labelledby="profile-popover"
      content={
        <div className="w-64 p-3 flex flex-col gap-4 text-white bg-gray-800 rounded-lg">
          <h1 className="text-left font-bold text-lg">Score Details</h1>
          <div className="flex flex-col items-center">
            <p className="font-bold text-xl">{userScore.toFixed(2)}</p>
            <p>{userStatus(parseFloat((userScore / signalsCount).toFixed(2)))}</p>
          </div>
          <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
          <h1 className="text-left font-medium text-base">Score Distribution</h1>
          <div className="h-32 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#33415555" />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
                    labelStyle={{ color: "#e2e8f0" }}
                    itemStyle={{ color: "#93c5fd" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#scoreFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                No data
              </div>
            )}
          </div>
          <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
          <h1 className="text-left font-medium text-base">Statistics</h1>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p>Mean</p>
              <p>{(userScore / signalsCount).toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Count</p>
              <p>{signalsCount}</p>
            </div>
          </div>
        </div>
      }
    >
      {userPage ? (
        <div className="flex flex-col items-center">
          <span className="text-slate-700 dark:text-white">{userScore.toFixed(2)}</span>
          <button
            className="hover:text-primary-link-button
          transition ease-out hover:dark:text-dark-link-button
          text-gray-600/70 dark:text-white/70 text-sm sm:text-base"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            score
          </button>
        </div>
      ) : (
        <p>
          <span className="text-slate-700 dark:text-white">{userScore.toFixed(2)}</span>{" "}
          <button
            className="hover:text-primary-link-button transition ease-out
               dark:hover:text-dark-link-button"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            score
          </button>
        </p>
      )}
    </Popover>
  )
}
