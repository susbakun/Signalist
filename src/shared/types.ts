import RootStore from '@/app/store'
import { CryptoResponseType } from './models'

export type RootState = ReturnType<typeof RootStore.getState>
export type CoinType = CryptoResponseType['data']['coins'][0]
export type StatusType = 'closed' | 'open' | 'not_opened'
