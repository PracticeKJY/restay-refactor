"use client"

import styles from "./RentModal.module.css"
import { useRecoilState } from "recoil"
import Modal from "./Modal"
import { useRentModal } from "@/pages/@recoil/store/state"
import { useMemo, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { divIcon } from "leaflet"
import Heading from "../Heading"
import { categories } from "./../Header/Categories"
import CategoryInput from "../Input/CategoryInput"
import CountrySelect from "../Input/CountrySelect"
import MapComponent from "../MapComponent"
import dynamic from "next/dynamic"

// enum? 관련된 상수들을 그룹화하고 식별하기 위해 사용됩니다. 특히, enum은 서로 연관된 상수의 집합을 정의하는 데 유용합니다. 이렇게 정의된 enum은 TypeScript 코드에서 해당 상수를 사용할 수 있게 되며, 가독성과 유지보수의 편의성을 높여줍니다.
// TypeScript에서는 enum 상수에 대한 값을 따로 지정하지 않으면, 0부터 시작하여 순차적인 값(0, 1, 2, ...)이 자동으로 할당됩니다
/**
 * actionLabel의 순서를 정의했습니다.
 * @readonly
 * @enum {number}
 */
enum STEPS {
  /** Selecting a category */
  CATEGORY,
  /** Selecting a location */
  LOCATION,
  /** Information such as title and deadline. */
  INFO,
  /** Uploading images. */
  IMAGES,
  /** Writing a description */
  DESCRIPTION,
  /** Setting a price */
  PRICE,
}

const RentModal = () => {
  const [step, setStep] = useState(STEPS.CATEGORY)
  const [isRentModal, SetIsRentModal] = useRecoilState(useRentModal)
  const [isLoading, setIsLoading] = useState(false)

  console.log(isRentModal, "랜트모달상태")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: "",
      price: 1,
      title: "",
      discription: "",
    },
  })

  const category = watch("category")
  const location = watch("location")
  const guestCount = watch("guestCount")
  const roomCount = watch("roomCount")
  const bathroomCount = watch("bathroomCount")
  const imageSrc = watch("imageSrc")
  const MapComponent = useMemo(
    () =>
      dynamic(() => import("../MapComponent"), {
        ssr: false,
      }),
    [location],
  )

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const handleClose = () => {
    SetIsRentModal(!isRentModal)
  }

  const onBack = () => {
    setStep((value) => value - 1)
  }
  const onNext = () => {
    setStep((value) => value + 1)
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext()
    }

    // setIsLoading(true)
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "생성"
    }

    return "다음"
  }, [step])

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined
    }

    return "뒤로"
  }, [step])

  let bodyContent = (
    <div className={styles.bodyContentContainer}>
      <Heading
        title="어떤 장소를 공유하실건가요?"
        subTitle="카테고리를 골라주세요"
      />
      <div className={styles.categoryWraaper}>
        {categories.map((item) => (
          <div key={item.label} className={styles.categoryContainer}>
            <CategoryInput
              onClick={(category) => {
                setCustomValue("category", category)
              }}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  )

  // STEP.LOCATION
  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className={styles.location}>
        <Heading
          title="어디에 위치하고 있나요?"
          subTitle="게스트들이 찾을 수 있도록 위치를 알려주세요"
        />
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <MapComponent center={location?.latlng} />
      </div>
    )
  }

  return (
    <Modal
      title="Restay할 준비가 되셨나요?"
      body={bodyContent}
      isOpen={isRentModal}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      secondaryActionLabel={secondaryActionLabel}
    />
  )
}

export default RentModal