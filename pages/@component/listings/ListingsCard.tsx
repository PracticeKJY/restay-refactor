"use client"

import { FC, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./ListingsCard.module.css"
import Image from "next/image"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import useCountries from "@/pages/@hooks/useCountries"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { Swiper as SwiperType, Navigation } from "swiper"
import { useRef } from "react"

import "swiper/css"
import "swiper/css/navigation"
import { useAtom } from "jotai"
import { favoriteAtom, wishListAtom } from "@/pages/@jotai/store/state"
import { useSession } from "next-auth/react"
import Modal from "../Modal/Modal"
import Heading from "../Heading"
import Input from "../Input/Input"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import toast from "react-hot-toast"

SwiperCore.use([Navigation])

interface ListingsCardProps {
  data: any
  userId: any
  wishList?: boolean
}

const ListingsCard: FC<ListingsCardProps> = ({ data, userId, wishList }) => {
  const [isHover, setIsHover] = useState(false)
  const router = useRouter()
  const { getByValue } = useCountries()
  const location = getByValue(data.locationValue)

  const productCards = data.imageSrc.map((src: string, index: any) => {
    return (
      <SwiperSlide key={index}>
        <Image
          width={300}
          height={300}
          alt=""
          src={src}
          className={styles.listingsImage}
          onClick={() => {
            router.push(`/listings/${data._id}`)
          }}
        />
      </SwiperSlide>
    )
  })

  const swiperRef = useRef<SwiperType>()

  const localePrice = data.price.toLocaleString("ko-KR")

  return (
    <>
      <div
        className={styles.listingsWrapper}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Swiper
          className={styles.swiper}
          modules={[Navigation]}
          loop
          slidesPerGroup={1}
          slidesPerView={1}
          spaceBetween={0}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper
          }}
        >
          {productCards}
        </Swiper>
        {!wishList && <FavoriteButton data={data} />}
        <button
          className={`${styles.prevButton} ${
            isHover ? styles.visibleButton : ""
          }`}
          onClick={() => swiperRef.current?.slidePrev()}
        >
          {"<"}
        </button>
        <button
          className={`${styles.nextButton} ${
            isHover ? styles.visibleButton : ""
          }`}
          onClick={() => swiperRef.current?.slideNext()}
        >
          {">"}
        </button>

        <div
          onClick={() => {
            router.push(`/listings/${data._id}`)
          }}
        >
          <div className={styles.listingsLocation}>
            {location?.region}, {location?.label}
          </div>
          <div className={styles.listingsCategory}>{data.category}</div>
          <div className={styles.listingsTitle}>{data.title}</div>
          <div>
            <span className={styles.listingsPrice}>￦{localePrice}</span>
            /박
          </div>
        </div>
      </div>
    </>
  )
}

export default ListingsCard

const FavoriteButton = ({ data }: any) => {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [unSubModal, setUnSubModal] = useState(false)
  const [isWishListModal, setIsWishListModal] = useState(false)
  const [favorite, setFavorite] = useAtom(favoriteAtom)
  const [wishListData, setWishListData] = useAtom(wishListAtom)

  const compareFavorite = favorite.some((item) => {
    if (session?.user?.email === item.email) {
      return item.id === data._id
    }
  })

  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldValues>({
    defaultValues: {
      wishListTitle: "",
    },
  })

  const handleSetFavorite = () => {
    if (session !== null) {
      if (!compareFavorite) {
        setIsWishListModal(true)
      }

      if (compareFavorite) {
        setUnSubModal(true)
      }
    }

    if (!session) {
      return console.log("로그인하고 하세요")
    }
  }

  const handleClose = () => {
    setIsWishListModal(false)
  }

  const onSubmit: SubmitHandler<FieldValues> = async (FormData) => {
    try {
      if (!session) {
        return
      }
      const modifyFormData = {
        ...FormData,
        id: data._id,
        email: session.user?.email,
      }

      setIsLoading(true)

      await axios.post("/api/favorite/favorite", modifyFormData)
      toast.success("위시리스트가 생성되었습니다.")
      const wishListDatas = await axios
        .get("api/favorite/findFavorite")
        .then((res) => res.data)
      setWishListData(wishListDatas)
      const favorite = await axios
        .get("api/favorite/findHasFavorite")
        .then((res) => res.data)
      setFavorite(favorite)
      setIsWishListModal(false)
      reset()
    } catch (e) {
      toast.error("위시리스트 생성에 실패했어요.")
    } finally {
      setIsLoading(false)
    }
  }

  const unSubHandler: SubmitHandler<FieldValues> = () => {
    if (session) {
      const email = session.user?.email
      const id = data._id
      const modifyData = { email, id }

      setIsLoading(true)

      axios
        .post("/api/favorite/deleteFavorite", modifyData)
        .then(() => {
          const findHasFavorite = async () => {
            const response = await axios.get("api/favorite/findHasFavorite")
            const data = response.data
            setFavorite(data)
          }
          findHasFavorite()
          setUnSubModal(false)
          reset()
        })
        .catch(() => {
          toast.error("위시리스트 삭제에 실패했어요.")
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  const bodyContent = (
    <div className={styles.bodyContentContainer}>
      <Heading
        title="새로운 위시리스트 추가"
        subTitle="위시리스트의 제목을 적어주세요."
      />
      <Input
        id={"wishListTitle"}
        label={"wishListTitle"}
        register={register}
        errors={errors}
        disabled={isLoading}
      />
    </div>
  )

  const wishListModal = (
    <Modal
      title="위시리스트 추가"
      body={bodyContent}
      isOpen={isWishListModal}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={"확인"}
    />
  )
  //조건부렌더링, 구독취소

  const unSubBodyContent = <Heading title="취소하시겠어요?" />

  const unSubHandleClose = () => {
    setUnSubModal(false)
  }
  const unSubWishListModal = (
    <Modal
      body={unSubBodyContent}
      isOpen={unSubModal}
      onClose={unSubHandleClose}
      onSubmit={handleSubmit(unSubHandler)}
      actionLabel={"확인"}
    />
  )

  const testFindId = favorite.filter((data) => {
    return session?.user?.email === data.email
  })

  const checkHeartById = testFindId.some((datalist) => {
    return data._id === datalist.id
  })

  return (
    <>
      {isWishListModal && wishListModal}
      {unSubModal && unSubWishListModal}
      <div onClick={handleSetFavorite}>
        {checkHeartById ? (
          <AiFillHeart size={28} className={styles.aiFillHeart} />
        ) : (
          <AiOutlineHeart size={28} className={styles.aiOutlineHeart} />
        )}
      </div>
    </>
  )
}
