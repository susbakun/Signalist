import { CreateSignalButton, CreateSignalModal } from "@/components"
import { type SignalsFilters } from "@/shared/types"
import { SignalsInlineFilters } from "@/components/Inline/SignalsInlineFilters"
import { useEffect, useState } from "react"
import { VscFilter } from "react-icons/vsc"
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { fetchTopSignals } from "@/services/signalsApi"
import { SignalModel } from "@/shared/models"
import { cn, timeAgoFromNow } from "@/utils"
import { AiOutlineRise } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store"
import { setSignalsFilters } from "@/features/Signal/signalsSlice"

export const SignalsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [openCreateSignalModal, setOpenCreateSignalModal] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<SignalsFilters>({})

  const handleCloseCreateSignalModal = () => {
    setOpenCreateSignalModal(false)
  }

  const hanldeOpenCreateSignalModal = () => {
    setOpenCreateSignalModal(true)
  }

  useEffect(() => {
    if (location.pathname === "/signals") {
      navigate("followings")
    }
  }, [location, navigate])

  // Sync local filters with redux so child pages can use them when fetching
  useEffect(() => {
    dispatch(setSignalsFilters(filters))
  }, [dispatch, filters])

  return (
    <div className="flex flex-col md:flex-row">
      <div
        className="flex-1 md:border-r dark:md:border-r-white/20
      md:border-r-gray-600/20 overflow-hidden"
      >
        <SignalsTopBar onToggleFilters={() => setIsFiltersOpen((p) => !p)}>
          <div className="px-4">
            <SignalsInlineFilters
              isOpen={isFiltersOpen}
              value={filters}
              onChange={setFilters}
              onClose={() => setIsFiltersOpen(false)}
            />
          </div>
        </SignalsTopBar>
        <Outlet />
      </div>
      <div className="hidden md:block w-[38%]">
        <RightSideBarSignals />
      </div>
      <CreateSignalButton handleOpenModal={hanldeOpenCreateSignalModal} />
      <CreateSignalModal
        openModal={openCreateSignalModal}
        handleCloseModal={handleCloseCreateSignalModal}
      />
      {/* Inline filters replaces the drawer */}
    </div>
  )
}

const SignalsTopBar = ({
  children,
  onToggleFilters
}: {
  children?: React.ReactNode
  onToggleFilters: () => void
}) => {
  return (
    <div
      className="flex flex-col gap-8 sticky top-0 pt-8
      dark:bg-dark-main bg-primary-main"
    >
      <div className="px-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Signals</h2>
        <button
          className="action-button flex items-center gap-2 dark:bg-gray-600
         bg-gray-300 rounded-full px-4 py-2"
          onClick={onToggleFilters}
        >
          <VscFilter className="w-4 h-4" /> Filter
        </button>
      </div>
      {children}
      <div
        className="border-b border-b-gray-600/20 dark:border-b-white/20
        flex justify-evenly gap-20"
      >
        <NavLink className="explore-nav-link" to="followings">
          Followings
        </NavLink>
        <NavLink className="explore-nav-link" to="suggests">
          Suggests
        </NavLink>
      </div>
    </div>
  )
}

const RightSideBarSignals = () => {
  const [topSignals, setTopSignals] = useState<SignalModel[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTopSignals(3)
        setTopSignals(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <aside className="w-full h-screen flex flex-col pt-8 px-4 md:px-8 sticky top-0">
      <div
        className="border border-gray-600/20 dark:border-white/20
        rounded-xl gap-4 p-3 flex flex-col"
      >
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-emerald-400">
            <AiOutlineRise />
          </span>{" "}
          Top Signals This Week
        </h2>
        {loading ? (
          <div className="py-16 text-center opacity-70">Loading...</div>
        ) : topSignals.length === 0 ? (
          <div className="py-8 text-center opacity-70">No signals</div>
        ) : (
          <div className="flex flex-col gap-4">
            {topSignals.map((s, idx) => (
              <div
                key={s.id}
                className={cn(
                  "rounded-xl p-4 flex items-center justify-between",
                  "bg-gray-300/40 dark:bg-gray-600/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center
                   justify-center text-sm font-bold bg-gray-300 dark:bg-gray-600"
                  >
                    {idx + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{s.market?.name}</span>
                    <Link to={`/${s.user.username}`} className="text-sm opacity-70">
                      @{s.user.username}
                    </Link>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">{(s.score ?? 0).toFixed(2)}</div>
                  <div className="text-xs opacity-70">{timeAgoFromNow(s.date)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
