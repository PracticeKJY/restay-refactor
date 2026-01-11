"use client";

import styles from "./RentModal.module.css";
import Modal from "./Modal";
import { latlngAtom, rentModalAtom } from "../../../jotai/@store/state";
import { useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Heading from "../Heading";
import { categories } from "./../Header/Categories";
import CategoryInput from "../Input/CategoryInput";
import Counter from "../Input/Counter";
import ImageUpload from "./../Input/ImageUpload";
import Input from "../Input/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAtomValue, useSetAtom } from "jotai";
import TextArea from "../Input/TextArea";
import KakaoMap from "../KakaoMap";
import DaumPost from "../DaumPost";

enum STEPS {
  CATEGORY,
  LOCATION,
  INFO,
  IMAGES,
  DESCRIPTION,
  PRICE,
}

interface RentModalProps {
  sessionEmail?: string | null;
}

const RentModalClient = ({ sessionEmail }: RentModalProps) => {
  const [step, setStep] = useState(STEPS.CATEGORY);
  const isRentModal = useAtomValue(rentModalAtom);
  const setIsRentModal = useSetAtom(rentModalAtom);
  const latlng = useAtomValue(latlngAtom);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
      description: "",
    },
  });

  const category = watch("category");
  const location = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc");
  const title = watch("title");
  const price = watch("price");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleClose = () => {
    setIsRentModal(!isRentModal);
  };

  const onBack = () => setStep((v) => v - 1);
  const onNext = () => setStep((v) => v + 1);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (!sessionEmail) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }

    if (step !== STEPS.PRICE) {
      return onNext();
    }

    const modifyFormData = {
      ...data,
      emailData: sessionEmail, // ✅ 여기
      latlngData: latlng,
    };

    setIsLoading(true);

    axios
      .post("/api/listings/listings", modifyFormData)
      .then(() => {
        toast.success("리스트가 생성되었어요");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        setIsRentModal(!isRentModal);
      })
      .catch(() => {
        toast.error("리스트 생성에 실패했어요");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => (step === STEPS.PRICE ? "생성" : "다음"), [step]);

  const secondaryActionLabel = useMemo(() => (step === STEPS.CATEGORY ? undefined : "뒤로"), [step]);

  /* ---------- bodyContent (기존 그대로) ---------- */
  let bodyContent = (
    <div className={styles.bodyContentContainer}>
      <Heading title="어떤 장소를 공유하실건가요?" subTitle="다음 중 장소를 가장 잘 설명하는 것을 선택해주세요." />
      <div className={styles.categoryWraaper}>
        {categories.map((item) => (
          <CategoryInput key={item.label} onClick={(category) => setCustomValue("category", category)} selected={category === item.label} label={item.label} icon={item.icon} />
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className={styles.bodyContentContainer}>
        <Heading title="어디에 위치하고 있나요?" />
        <DaumPost value={location} onChange={(v) => setCustomValue("location", v)} />
        <KakaoMap />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className={styles.bodyContentContainer}>
        <Heading title="몇 가지 정보를 알려주세요." />
        <Counter title={"게스트"} subTitle={"총 인원수를 알려주세요."} value={guestCount} onChange={(value) => setCustomValue("guestCount", value)} />
        <Counter title={"방"} subTitle={"총 방의 갯수를 알려주세요."} value={roomCount} onChange={(value) => setCustomValue("roomCount", value)} />
        <Counter title={"화장실"} subTitle={"총 화장실의 갯수를 알려주세요."} value={bathroomCount} onChange={(value) => setCustomValue("bathroomCount", value)} />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className={styles.bodyContentContainer}>
        <Heading title="사진을 업로드해주세요." />
        <ImageUpload value={imageSrc} onChange={(v) => setCustomValue("imageSrc", v)} />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className={styles.bodyContentContainer}>
        <Heading title="공간을 설명해주세요." />
        <Input id="title" label="Title" register={register} errors={errors} required />
        <TextArea id="description" label="Description" register={register} errors={errors} required />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className={styles.bodyContentContainer}>
        <Heading title="가격을 정해주세요." />
        <Input id="price" label="Price" type="number" register={register} errors={errors} required />
      </div>
    );
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
      disabled={isLoading}
    />
  );
};

export default RentModalClient;
