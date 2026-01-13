"use client";

import { useState } from "react";
import styles from "./ListingsCard.module.css";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import { useAtom } from "jotai";
import { favoriteAtom, favoriteAtomProps, wishListAtom, wishListAtomProps } from "../../../jotai/@store/state";

import Modal from "../Modal/Modal";
import Heading from "../Heading";
import Input from "../Input/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { GET, POST } from "@/app/@http/request";

type Props = {
  data: any;
  sessionEmail?: string | null;
  sessionName?: string | null;
  sessionImage?: string | null;
};

const FavoriteButton = ({ data, sessionEmail }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [unSubModal, setUnSubModal] = useState(false);
  const [isWishListModal, setIsWishListModal] = useState(false);

  const [favorite, setFavorite] = useAtom(favoriteAtom);
  const [wishListData, setWishListData] = useAtom(wishListAtom);

  const isLoggedIn = !!sessionEmail;

  const compareFavorite = favorite.some((item) => {
    if (sessionEmail && sessionEmail === item.email) {
      return item.id === data._id;
    }
    return false;
  });

  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldValues>({
    defaultValues: { wishListTitle: "" },
  });

  const handleSetFavorite = () => {
    console.log(sessionEmail, "sessionEmail");

    if (!sessionEmail) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    if (!compareFavorite) setIsWishListModal(true);
    else setUnSubModal(true);
  };

  const handleClose = () => setIsWishListModal(false);

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    try {
      if (!isLoggedIn || !sessionEmail) return;

      const modifyFormData = {
        ...formData,
        id: data._id,
        email: sessionEmail,
      };

      setIsLoading(true);

      await POST("/api/favorite/favorite", modifyFormData);
      toast.success("위시리스트가 생성되었습니다.");

      const wishListDatas = await GET<wishListAtomProps[]>("api/favorite/findFavorite").then((res) => res.data);
      setWishListData(wishListDatas);

      const fav = await GET<favoriteAtomProps[]>("api/favorite/findHasFavorite").then((res) => res.data);
      setFavorite(fav);

      setIsWishListModal(false);
      reset();
    } catch {
      toast.error("위시리스트 생성에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  const unSubHandler: SubmitHandler<FieldValues> = async () => {
    try {
      if (!isLoggedIn || !sessionEmail) return;

      const modifyData = { email: sessionEmail, id: data._id };

      setIsLoading(true);

      await POST("/api/favorite/deleteFavorite", modifyData);

      const findHasFavorite = await GET<favoriteAtomProps[]>("api/favorite/findHasFavorite").then((res) => res.data);
      setFavorite(findHasFavorite);

      const wishListDatas = await GET<wishListAtomProps[]>("api/favorite/findFavorite").then((res) => res.data);
      setWishListData(wishListDatas);

      setUnSubModal(false);
      reset();
    } catch {
      toast.error("위시리스트 삭제에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className={styles.bodyContentContainer}>
      <Heading title="새로운 위시리스트 추가" subTitle="위시리스트의 제목을 적어주세요." />
      <Input id={"wishListTitle"} label={"wishListTitle"} register={register} errors={errors} disabled={isLoading} />
    </div>
  );

  const wishListModal = <Modal title="위시리스트 추가" body={bodyContent} isOpen={isWishListModal} onClose={handleClose} onSubmit={handleSubmit(onSubmit)} actionLabel={"확인"} />;

  const unSubBodyContent = <Heading title="취소하시겠어요?" />;

  const unSubWishListModal = <Modal body={unSubBodyContent} isOpen={unSubModal} onClose={() => setUnSubModal(false)} onSubmit={handleSubmit(unSubHandler)} actionLabel={"확인"} />;

  const myFavorites = favorite.filter((f) => sessionEmail && f.email === sessionEmail);
  const checkHeartById = myFavorites.some((f) => data._id === f.id);

  return (
    <>
      {isWishListModal && wishListModal}
      {unSubModal && unSubWishListModal}

      <div onClick={handleSetFavorite}>
        {checkHeartById ? <AiFillHeart size={28} className={styles.aiFillHeart} /> : <AiOutlineHeart size={28} className={styles.aiOutlineHeart} />}
      </div>
    </>
  );
};

export default FavoriteButton;

// before
// "use client";

// import { FC, useState } from "react";
// import styles from "./ListingsCard.module.css";
// import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

// import { useAtom } from "jotai";
// import { favoriteAtom, favoriteAtomProps, wishListAtom, wishListAtomProps } from "../../../jotai/@store/state";
// import { useSession } from "next-auth/react";
// import Modal from "../Modal/Modal";
// import Heading from "../Heading";
// import Input from "../Input/Input";
// import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { GET, POST } from "@/app/@http/request";

// const FavoriteButton = ({ data }: any) => {
//   const { data: session } = useSession();
//   const [isLoading, setIsLoading] = useState(false);
//   const [unSubModal, setUnSubModal] = useState(false);
//   const [isWishListModal, setIsWishListModal] = useState(false);
//   const [favorite, setFavorite] = useAtom(favoriteAtom);
//   const [wishListData, setWishListData] = useAtom(wishListAtom);

//   const compareFavorite = favorite.some((item) => {
//     if (session?.user?.email === item.email) {
//       return item.id === data._id;
//     }
//   });

//   const {
//     reset,
//     register,
//     formState: { errors },
//     handleSubmit,
//   } = useForm<FieldValues>({
//     defaultValues: {
//       wishListTitle: "",
//     },
//   });

//   const handleSetFavorite = () => {
//     if (session !== null) {
//       if (!compareFavorite) {
//         setIsWishListModal(true);
//       }

//       if (compareFavorite) {
//         setUnSubModal(true);
//       }
//     }

//     if (!session) {
//       return alert("로그인 후 이용해주세요.");
//     }
//   };

//   const handleClose = () => {
//     setIsWishListModal(false);
//   };

//   const onSubmit: SubmitHandler<FieldValues> = async (FormData) => {
//     try {
//       if (!session) {
//         return;
//       }
//       const modifyFormData = {
//         ...FormData,
//         id: data._id,
//         email: session.user?.email,
//       };

//       setIsLoading(true);

//       await POST("/api/favorite/favorite", modifyFormData);
//       toast.success("위시리스트가 생성되었습니다.");
//       const wishListDatas = await GET<wishListAtomProps[]>("api/favorite/findFavorite").then((res) => res.data);
//       setWishListData(wishListDatas);
//       const favorite = await GET<favoriteAtomProps[]>("api/favorite/findHasFavorite").then((res) => res.data);
//       setFavorite(favorite);
//       setIsWishListModal(false);
//       reset();
//     } catch (e) {
//       toast.error("위시리스트 생성에 실패했어요.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const unSubHandler: SubmitHandler<FieldValues> = async () => {
//     try {
//       if (!session) {
//         return;
//       }

//       const email = session.user?.email;
//       const id = data._id;
//       const modifyData = { email, id };

//       setIsLoading(true);

//       await POST("/api/favorite/deleteFavorite", modifyData);
//       const findHasFavorite = await GET<favoriteAtomProps[]>("api/favorite/findHasFavorite").then((res) => res.data);
//       setFavorite(findHasFavorite);
//       const wishListDatas = await GET<wishListAtomProps[]>("api/favorite/findFavorite").then((res) => res.data);
//       setWishListData(wishListDatas);

//       setUnSubModal(false);
//       reset();
//     } catch (e) {
//       toast.error("위시리스트 삭제에 실패했어요.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const bodyContent = (
//     <div className={styles.bodyContentContainer}>
//       <Heading title="새로운 위시리스트 추가" subTitle="위시리스트의 제목을 적어주세요." />
//       <Input id={"wishListTitle"} label={"wishListTitle"} register={register} errors={errors} disabled={isLoading} />
//     </div>
//   );

//   const wishListModal = <Modal title="위시리스트 추가" body={bodyContent} isOpen={isWishListModal} onClose={handleClose} onSubmit={handleSubmit(onSubmit)} actionLabel={"확인"} />;
//   //조건부렌더링, 구독취소

//   const unSubBodyContent = <Heading title="취소하시겠어요?" />;

//   const unSubHandleClose = () => {
//     setUnSubModal(false);
//   };
//   const unSubWishListModal = <Modal body={unSubBodyContent} isOpen={unSubModal} onClose={unSubHandleClose} onSubmit={handleSubmit(unSubHandler)} actionLabel={"확인"} />;

//   const testFindId = favorite.filter((data) => {
//     return session?.user?.email === data.email;
//   });

//   const checkHeartById = testFindId.some((datalist) => {
//     return data._id === datalist.id;
//   });

//   return (
//     <>
//       {isWishListModal && wishListModal}
//       {unSubModal && unSubWishListModal}
//       <div onClick={handleSetFavorite}>
//         {checkHeartById ? <AiFillHeart size={28} className={styles.aiFillHeart} /> : <AiOutlineHeart size={28} className={styles.aiOutlineHeart} />}
//       </div>
//     </>
//   );
// };

// export default FavoriteButton;
