import {
  CustomDropdown,
  Loader,
  SignalModalChart,
  SignalModalDatePickers,
  SignalModalFileInput,
  SignalModalFooter,
  SignalModalTargetsList,
  SignalModalTextArea,
  SignalModalTopInputs
} from "@/components"
import { useAppSelector } from "@/features/Post/postsSlice"
import { createSignal } from "@/features/Signal/signalsSlice"
import { useGetCryptosQuery } from "@/services/cryptoApi"
import { CryptoResponseType, SignalModel } from "@/shared/models"
import { CoinType, SignalAccountType } from "@/shared/types"
import { Client, ID, Storage } from "appwrite"
import { Label, Modal } from "flowbite-react"
import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { v4 } from "uuid"

type CreateSignalModalProps = {
  openModal: boolean
  handleCloseModal: () => void
}

export const CreateSignalModal = ({ openModal, handleCloseModal }: CreateSignalModalProps) => {
  const [targetList, setTargetList] = useState<SignalModel["targets"]>([])
  const [dropdownMarkets, setDropDownMarkets] = useState<CryptoResponseType["data"]["coins"]>([])
  const [selectedMarket, setSelectedMarket] = useState<SignalModel["market"]>({
    name: "BTC",
    uuid: "Qwsogvtv82FCd"
  })
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [openTime, setOpenTime] = useState<Date>(new Date())
  const [closeTime, setCloseTime] = useState<Date>(new Date())
  const [entryValue, setEntryValue] = useState(0.0)
  const [stoplossValue, setStoplossValue] = useState(0.0)
  const [descriptionText, setDescriptionText] = useState("")
  const [isPremium, setIsPremium] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined)
  const [postButtonDisabled, setPostButtonDisabled] = useState(false)

  const { data: cryptosList, isLoading } = useGetCryptosQuery(20)
  const dispatch = useDispatch()
  const users = useAppSelector((state) => state.users)
  const myAccount = users.find((user) => user.username === "Amir_Aryan")!
  const signalPublisher: SignalAccountType = {
    name: myAccount.name,
    score: myAccount.score,
    username: myAccount.username,
    imageUrl: myAccount.imageUrl
  }

  const handleSelectMarket = (market: SignalModel["market"]) => {
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
    setTargetList((prev) => [...prev, { id: v4(), value: 0, touched: undefined }])
  }

  const handleRemoveTarget = (removedTargetId: string) => {
    setTargetList((prev) => {
      return prev.filter((target) => target.id !== removedTargetId)
    })
  }

  const getStatus = (
    openTime: SignalModel["openTime"],
    closeTime: SignalModel["closeTime"]
  ): SignalModel["status"] => {
    const currentTime = new Date().getTime()
    if (currentTime - openTime >= 0 && currentTime - closeTime < 0) {
      return "open"
    } else if (currentTime - openTime >= 0 && currentTime - closeTime >= 0) {
      return "closed"
    } else {
      return "not_opened"
    }
  }

  const handleTargetValueChange = (e: ChangeEvent<HTMLInputElement>, targetId: string) => {
    setTargetList((prev) => {
      return prev.map((target) => {
        if (target.id === targetId) {
          return { ...target, value: parseFloat(e.target.value) }
        }
        return target
      })
    })
  }

  const resetForm = () => {
    handleCloseModal()
    setCloseTime(new Date())
    setOpenTime(new Date())
    setEntryValue(0.0)
    setStoplossValue(0.0)
    setTargetList([])
    setDescriptionText("")
    setShowChart(false)
    setPostButtonDisabled(false)
    setSelectedMarket({ name: "BTC", uuid: "Qwsogvtv82FCd" })
  }

  const handleCreateSignal = async () => {
    setPostButtonDisabled(true)
    const chartImageId = await handleSendImage(selectedImage)
    dispatch(
      createSignal({
        openTime: openTime.getTime(),
        closeTime: closeTime.getTime(),
        chartImageId,
        market: { ...selectedMarket, name: `${selectedMarket.name}/USD` },
        entry: entryValue,
        stoploss: stoplossValue,
        targets: targetList,
        description: descriptionText,
        publisher: signalPublisher,
        isPremium,
        status: getStatus(openTime.getTime(), closeTime.getTime())
      })
    )
    resetForm()
  }

  const handleOpenTimeChange = (date: Date) => {
    setOpenTime(date)
  }

  const handleCloseTimeChange = (date: Date) => {
    setCloseTime(date)
  }

  const handleEntryValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEntryValue(parseFloat(e.target.value))
  }

  const handleStoplossValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStoplossValue(parseFloat(e.target.value))
  }

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionText(e.target.value)
  }

  const handlePremiumToggle = () => {
    setIsPremium((prev) => !prev)
  }

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleCancelSelectImage = () => {
    setSelectedImage(undefined)
  }

  const handleSendImage = async (selectedFile: File | undefined) => {
    if (selectedFile) {
      const file = new File([selectedFile], "screenshot.png", { type: "image/png" })
      try {
        const response = await storage.createFile("66747baf000aa8c5c2e7", ID.unique(), file)
        console.log("Image uploaded successfully:", response)
        return response.$id
      } catch (error) {
        console.error("Failed to upload image:", error)
      }
    }
  }

  const market: CoinType = useMemo(
    () => dropdownMarkets.find((market) => market.symbol === selectedMarket.name),
    [selectedMarket, dropdownMarkets]
  )!

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66747b890009cb1b3f8a")

  const storage = new Storage(client)

  useEffect(() => {
    if (cryptosList?.data.coins) {
      setDropDownMarkets(cryptosList.data.coins)
    }
  }, [cryptosList])

  return (
    <Modal className="pl-9 custom-modal" size="5xl" show={openModal} onClose={resetForm}>
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
                      key={target.id}
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
                  <SignalModalFileInput
                    handleChangeImage={handleChangeImage}
                    handleCancelSelectImage={handleCancelSelectImage}
                  />
                  <SignalModalFooter
                    postButtonDisabled={postButtonDisabled}
                    isPremium={isPremium}
                    handlePremiumToggle={handlePremiumToggle}
                    handleCreateSignal={handleCreateSignal}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}
