import { AccountModel } from "@/shared/models"
import millify from "millify"
import { Link } from "react-router-dom"
import { getUserSignalsCountAsync } from "@/features/User/usersSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store"
import { useEffect, useState } from "react"
import { ScoreDetailsPopover } from "@/components"
import { fetchUserSignals } from "@/services/signalsApi"

type UserNumericInfoProps = {
  userAccount: AccountModel
}

export const UserNumericInfo = ({ userAccount }: UserNumericInfoProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [userSignals, setUserSignals] = useState<{ date: number; score: number }[]>([])

  useEffect(() => {
    if (userAccount?.username) {
      dispatch(getUserSignalsCountAsync(userAccount.username))
    }
  }, [dispatch, userAccount?.username])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!userAccount?.username) return
      try {
        const sigs = await fetchUserSignals(userAccount.username)
        if (!cancelled) setUserSignals(sigs)
      } catch (err) {
        console.error("Failed to load user signals", err)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [userAccount?.username])

  return (
    <div className="text-base sm:text-lg text-gray-500 dark:text-gray-400 flex gap-6 sm:gap-10 md:gap-14 items-center font-medium">
      <div className="flex flex-col items-center">
        <ScoreDetailsPopover
          userPage={true}
          signalsCount={userSignals.length}
          userScore={userAccount.score}
          signals={userSignals}
        />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-slate-700 dark:text-white">
          {millify(userAccount.followers?.length || 0)}
        </span>
        <Link
          className="hover:text-primary-link-button
          transition ease-out hover:dark:text-dark-link-button
          text-gray-600/70 dark:text-white/70 text-sm sm:text-base"
          to={`/${userAccount.username}/followers`}
        >
          followers
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-slate-700 dark:text-white">
          {millify(userAccount.followings?.length || 0)}
        </span>
        <Link
          className="hover:text-primary-link-button
          transition ease-out hover:dark:text-dark-link-button
          text-gray-600/70 dark:text-white/70 text-sm sm:text-base"
          to={`/${userAccount.username}/followings`}
        >
          following
        </Link>
      </div>
    </div>
  )
}
