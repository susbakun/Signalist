import {
  CustomDropdown,
  Loader,
  SignalModalChart,
  SignalModalDatePickers,
  SignalModalFooter,
  SignalModalTargetsList,
  SignalModalTextArea,
  SignalModalTopInputs
} from '@/components'
import { useAppSelector } from '@/features/Post/postsSlice'
import { createSignal } from '@/features/Signal/signalsSlice'
import { useGetCryptosQuery } from '@/services/cryptoApi'
import { CryptoResponseType, SignalModel } from '@/shared/models'
import { CoinType } from '@/shared/types'
import { Label, Modal } from 'flowbite-react'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

type CreateSignalModalProps = {
  openModal: boolean
  handleCloseModal: () => void
}

export const CreateSignalModal = ({ openModal, handleCloseModal }: CreateSignalModalProps) => {
  const [targetList, setTargetList] = useState<SignalModel['targets']>([])
  const [dropdownMarkets, setDropDownMarkets] = useState<CryptoResponseType['data']['coins']>([])
  const [selectedMarket, setSelectedMarket] = useState('BTC')
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [openTime, setOpenTime] = useState<Date>(new Date())
  const [closeTime, setCloseTime] = useState<Date>(new Date())
  const [entryValue, setEntryValue] = useState(0)
  const [stoplossValue, setStoplossValue] = useState(0)
  const [descriptionText, setDescriptionText] = useState('')

  const { data: cryptosList, isLoading } = useGetCryptosQuery(20)
  const dispatch = useDispatch()
  const users = useAppSelector((state) => state.users)
  const me = users.find((user) => user.username === 'Amir Aryan')

  const handleSelectMarket = (market: SignalModel['market']) => {
    setSelectedMarket(market)
    handleToggleDropDown()
  }

  const handleToggleChart = () => {
    setShowChart((prev) => !prev)
  }

  const handleToggleDropDown = () => {
    setIsDropDownOpen((prev) => !prev)
  }

  const handleAddTarget = () => {
    setTargetList((prev) => [...prev, { value: 0, touched: false }])
  }

  const handleRemoveTarget = (targetIndex: number) => {
    setTargetList((prev) => {
      return prev.filter((target, index) => {
        if (index !== targetIndex) {
          return target
        }
      })
    })
  }

  const getStatus = (
    openTime: SignalModel['openTime'],
    closeTime: SignalModel['closeTime']
  ): SignalModel['status'] => {
    const currentTime = new Date().getTime()
    if (currentTime - openTime >= 0 && currentTime - closeTime < 0) {
      return 'open'
    } else if (currentTime - openTime >= 0 && currentTime - closeTime >= 0) {
      return 'closed'
    } else {
      return 'not_opened'
    }
  }

  const handleCreateSignal = () => {
    handleCloseModal()
    dispatch(
      createSignal({
        openTime: openTime.getTime(),
        closeTime: closeTime.getTime(),
        showChart,
        market: `${selectedMarket}/USD`,
        entry: entryValue,
        stoploss: stoplossValue,
        targets: targetList,
        description: descriptionText,
        publisher: me,
        status: getStatus(openTime.getTime(), closeTime.getTime())
      })
    )
  }

  const handleTargetValueChange = (e: ChangeEvent<HTMLInputElement>, targetIndex: number) => {
    setTargetList((prev) => {
      return prev.map((target, index) => {
        if (index === targetIndex) {
          return { value: +e.target.value, touched: undefined }
        }
        return target
      })
    })
  }

  const handleOpenTimeChange = (date: Date) => {
    setOpenTime(date)
  }

  const handleCloseTimeChange = (date: Date) => {
    setCloseTime(date)
  }

  const handleEntryValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEntryValue(+e.target.value)
  }

  const handleStoplossValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStoplossValue(+e.target.value)
  }

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionText(e.target.value)
  }

  const market: CoinType | undefined = useMemo(
    () => dropdownMarkets.find((market) => market.symbol === selectedMarket),
    [selectedMarket, dropdownMarkets]
  )

  useEffect(() => {
    if (cryptosList?.data.coins) {
      setDropDownMarkets(cryptosList.data.coins)
    }
  }, [cryptosList])

  return (
    <Modal className="pl-9 custom-modal" size="5xl" show={openModal} onClose={handleCloseModal}>
      <Modal.Header className="border-none pr-1 py-2" />
      <Modal.Body
        className="flex overflow-y-auto
        flex-col gap-2 py-4 mb-4 px-4 custom-modal"
      >
        {!dropdownMarkets.length || isLoading ? (
          <Loader className="h-[80vh]" />
        ) : (
          <div className="flex flex-col gap-2 h-[80vh]">
            <div className="h-full flex flex-col relative gap-4">
              <Label className="text-xl" htmlFor="markets" value="Select your market:" />
              <CustomDropdown
                markets={dropdownMarkets}
                selectedMarket={market}
                handleSelectMarket={handleSelectMarket}
                isLoading={isLoading}
                isDropDownOpen={isDropDownOpen}
                handleToggleDropDown={handleToggleDropDown}
              />
              <SignalModalChart
                showChart={showChart}
                handleToggleChart={handleToggleChart}
                marketSymbol={market?.symbol}
              />
              <div
                className="bg-gray-100 dark:bg-gray-800
                p-4 rounded-lg flex flex-col gap-12"
              >
                <SignalModalTopInputs
                  entryValue={entryValue}
                  stoplossValue={stoplossValue}
                  handleStoplossValueChange={handleStoplossValueChange}
                  handleEntryValueChange={handleEntryValueChange}
                />
                <div className="flex flex-col gap-4">
                  {targetList.map((target, index) => (
                    <SignalModalTargetsList
                      key={target.value}
                      target={target}
                      index={index}
                      handleRemoveTarget={handleRemoveTarget}
                      handleTargetValueChange={handleTargetValueChange}
                    />
                  ))}

                  <SignalModalDatePickers
                    openTime={openTime}
                    closeTime={closeTime}
                    handleCloseTimeChange={handleCloseTimeChange}
                    handleOpenTimeChange={handleOpenTimeChange}
                    handleAddTarget={handleAddTarget}
                  />
                  <SignalModalTextArea
                    descriptionText={descriptionText}
                    handleDescriptionChange={handleDescriptionChange}
                  />
                  <SignalModalFooter handleCreateSignal={handleCreateSignal} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}
