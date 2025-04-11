import { AppDispatch } from "@/app/store"
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
import { createSignalAsync } from "@/features/Signal/signalsSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useGetWallexMarketsQuery } from "@/services/cryptoApi"
import { SignalModel } from "@/shared/models"
import { CoinType, SignalAccountType } from "@/shared/types"
import { transformWallexData } from "@/utils"
import { Label, Modal } from "flowbite-react"
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { v4 } from "uuid"

type CreateSignalModalProps = {
  openModal: boolean
  handleCloseModal: () => void
}

export const CreateSignalModal = ({ openModal, handleCloseModal }: CreateSignalModalProps) => {
  const [targetList, setTargetList] = useState<SignalModel["targets"]>([])
  const [dropdownMarkets, setDropDownMarkets] = useState<CoinType[]>([])
  const [selectedMarket, setSelectedMarket] = useState<SignalModel["market"]>({
    name: "BTC",
    uuid: "BTCUSDT",
    quoteAsset: "USDT"
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
  const [validationErrors, setValidationErrors] = useState<{
    entry: string
    stoploss: string
    openTime: string
    closeTime: string
    targets: string
  }>({
    entry: "",
    stoploss: "",
    openTime: "",
    closeTime: "",
    targets: ""
  })
  const [formTouched, setFormTouched] = useState(false)

  const { data: wallexData, isLoading } = useGetWallexMarketsQuery()
  const dispatch = useDispatch<AppDispatch>()
  const { currentUser: myAccount, loading: userLoading } = useCurrentUser()

  // Only create signalPublisher if myAccount exists
  const signalPublisher: SignalAccountType | undefined = myAccount
    ? {
        name: myAccount.name,
        username: myAccount.username,
        imageUrl: myAccount.imageUrl,
        score: myAccount.score || 0 // Provide default value for score
      }
    : undefined

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
    setFormTouched(true)
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
    setFormTouched(true)
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
    setSelectedMarket({ name: "BTC", uuid: "BTCUSDT", quoteAsset: "USDT" })
    setValidationErrors({
      entry: "",
      stoploss: "",
      openTime: "",
      closeTime: "",
      targets: ""
    })
    setFormTouched(false)
  }

  const handleCreateSignal = async () => {
    setFormTouched(true)

    // Check if signalPublisher exists
    if (!signalPublisher) {
      console.error("Cannot create signal: User information is missing")
      return
    }

    const isValid = validateSignalData()
    if (!isValid) {
      console.error("Validation failed:", validationErrors)
      return
    }

    // Check if signalPublisher exists
    if (!signalPublisher) {
      console.error("Cannot create signal: User information is missing")
      setPostButtonDisabled(false)
      return
    }

    setPostButtonDisabled(true)
    const chartImageHref = await handleSendImage(selectedImage)
    dispatch(
      createSignalAsync({
        openTime: openTime.getTime(),
        closeTime: closeTime.getTime(),
        chartImageHref,
        market: {
          ...selectedMarket,
          name: `${selectedMarket.name}/${selectedMarket.quoteAsset || "USD"}`
        },
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
    setFormTouched(true)
    setOpenTime(date)
  }

  const handleCloseTimeChange = (date: Date) => {
    setFormTouched(true)
    setCloseTime(date)
  }

  const handleEntryValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormTouched(true)
    setEntryValue(parseFloat(e.target.value))
  }

  const handleStoplossValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormTouched(true)
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
      const formData = new FormData()
      formData.append("file", selectedFile)
      try {
        const response = await fetch("https://signalist-backend.liara.run/api/upload/signals", {
          method: "POST",
          body: formData
        })
        const data = await response.json()
        console.log("Image uploaded successfully:", data)
        return data.url
      } catch (error) {
        console.error("Failed to upload image:", error)
      }
    }
  }

  const market: CoinType = useMemo(
    () => dropdownMarkets.find((market) => market.symbol === selectedMarket.name),
    [selectedMarket, dropdownMarkets]
  )!

  useEffect(() => {
    if (wallexData) {
      // Transform Wallex data to the format expected by components
      const transformedData = transformWallexData(wallexData)
      // Filter to only include USDT pairs for simplicity
      const usdtPairs = transformedData.filter((coin) => coin.quoteAsset === "USDT")
      setDropDownMarkets(usdtPairs)
    }
  }, [wallexData])

  const validateSignalData = useCallback(() => {
    const newErrors = {
      entry: "",
      stoploss: "",
      openTime: "",
      closeTime: "",
      targets: ""
    }
    if (entryValue <= 0) {
      newErrors.entry = "Entry value must be greater than 0"
    }

    if (stoplossValue <= 0) {
      newErrors.stoploss = "Stoploss value must be greater than 0"
    } else if (stoplossValue >= entryValue) {
      newErrors.stoploss = "Stoploss must be less than entry"
    }

    const now = new Date().getTime()
    if (openTime.getTime() < now) {
      newErrors.openTime = "Open time cannot be in the past"
    }

    if (closeTime.getTime() <= openTime.getTime()) {
      newErrors.closeTime = "Close time must be after open time"
    }

    if (targetList.length === 0) {
      newErrors.targets = "At least one target is required"
    } else {
      const invalidTargets = targetList.filter(
        (target) => target.value <= 0 || target.value <= entryValue
      )
      if (invalidTargets.length > 0) {
        newErrors.targets = "All targets must be greater than 0 and the entry value"
      }
    }

    setValidationErrors(newErrors)

    return Object.values(newErrors).every((error) => error === "")
  }, [entryValue, stoplossValue, openTime, closeTime, targetList])

  useEffect(() => {
    if (formTouched) {
      validateSignalData()
    }
  }, [validateSignalData, formTouched])

  const isFormValid = useMemo(() => {
    if (!formTouched) return false
    return validateSignalData()
  }, [formTouched, validateSignalData])

  return (
    <Modal className="pl-0 md:pl-9 custom-modal" size="5xl" show={openModal} onClose={resetForm}>
      <Modal.Header className="border-none pr-1 py-2" />
      <Modal.Body
        className="flex overflow-y-auto
        flex-col gap-2 py-2 md:py-4 mb-4 px-2 md:px-4 custom-modal"
      >
        {!dropdownMarkets.length || isLoading || userLoading ? (
          <Loader className="h-[80vh]" />
        ) : (
          <div className="flex flex-col gap-2 h-[80vh]">
            <div className="h-full flex flex-col relative gap-2 md:gap-4">
              <Label className="text-lg md:text-xl" htmlFor="markets" value="Select your market:" />
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
                p-2 md:p-4 rounded-lg flex flex-col gap-6 md:gap-12"
              >
                <SignalModalTopInputs
                  entryValue={entryValue}
                  stoplossValue={stoplossValue}
                  handleStoplossValueChange={handleStoplossValueChange}
                  handleEntryValueChange={handleEntryValueChange}
                  quoteAsset={selectedMarket.quoteAsset}
                />
                <div className="flex flex-col gap-4">
                  {targetList.map((target, index) => (
                    <SignalModalTargetsList
                      key={target.id}
                      target={target}
                      index={index}
                      entryValue={entryValue}
                      previousTargetValue={index > 0 ? targetList[index - 1].value : undefined}
                      handleRemoveTarget={handleRemoveTarget}
                      handleTargetValueChange={handleTargetValueChange}
                      quoteAsset={selectedMarket.quoteAsset}
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
                    selectedImage={selectedImage}
                    handleChangeImage={handleChangeImage}
                    handleCancelSelectImage={handleCancelSelectImage}
                  />
                  <SignalModalFooter
                    isPremium={isPremium}
                    handlePremiumToggle={handlePremiumToggle}
                    handleCreateSignal={handleCreateSignal}
                    postButtonDisabled={postButtonDisabled || !isFormValid}
                    isPosting={postButtonDisabled}
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
