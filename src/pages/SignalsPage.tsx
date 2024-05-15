import { Signal } from '@/components/Signal'
import { useAppSelector } from '@/features/Post/postsSlice'

export const SignalsPage = () => {
  return (
    <div className="flex">
      <ExploreSignals />
      <RightSidebar />
    </div>
  )
}

const ExploreSignals = () => {
  const signals = useAppSelector((state) => state.signals)

  return (
    <div
      className="flex-1 border-r dark:border-r-white/20
    border-r-gray-600/20"
    >
      <h2 className="text-xl px-4 pt-6 pb-2 font-bold">Signals</h2>
      <ul className="flex flex-col justify-center">
        {signals.map((signal) => (
          <Signal key={signal.id} signal={signal} />
        ))}
      </ul>
    </div>
  )
}

const RightSidebar = () => {
  return (
    <aside
      className="flex flex-col
      w-[30%] h-screen"
    ></aside>
  )
}
