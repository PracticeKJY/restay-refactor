"use client";
import { useTranslations } from "next-intl";


import styles from "./RentModal.module.css";
import Modal from "./Modal";
import { latlngAtom, rentModalAtom } from "../../../jotai/@store/state";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Heading from "../Heading";
import { categories } from "./../Header/Categories";
import CategoryInput from "../Input/CategoryInput";
import Counter from "../Input/Counter";
import ImageUpload from "./../Input/ImageUpload";
import Input from "../Input/Input";
import axios from "axios";
import { useRouter } from "@/i18n/navigation";
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
  const t = useTranslations("Hosting");

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
      toast.error(t("pleaseLogInToContinue"));
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
        toast.success(t("listingCreated"));
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        setIsRentModal(!isRentModal);
      })
      .catch(() => {
        toast.error(t("couldNotCreateTheListing"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = step === STEPS.PRICE ? t("create") : t("next");

  const secondaryActionLabel = step === STEPS.CATEGORY ? undefined : t("back");

  /* ---------- bodyContent (기존 그대로) ---------- */
  let bodyContent = (
    <div className={styles.bodyContentContainer}>
      <Heading title={t("whatKindOfSpaceWillYouShare")} subTitle={t("chooseTheCategoryThatBestDescribesYour")} />
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
        <Heading title={t("whereIsYourSpace")} />
        <DaumPost value={location} onChange={(v) => setCustomValue("location", v)} />
        <KakaoMap />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className={styles.bodyContentContainer}>
        <Heading title={t("tellUsALittleMore")} />
        <Counter title={t("guests")} subTitle={t("howManyGuestsCanStay")} value={guestCount} onChange={(value) => setCustomValue("guestCount", value)} />
        <Counter title={t("rooms")} subTitle={t("howManyRoomsAreThere")} value={roomCount} onChange={(value) => setCustomValue("roomCount", value)} />
        <Counter title={t("bathrooms")} subTitle={t("howManyBathroomsAreThere")} value={bathroomCount} onChange={(value) => setCustomValue("bathroomCount", value)} />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className={styles.bodyContentContainer}>
        <Heading title={t("uploadPhotosOfYourSpace")} />
        <ImageUpload value={imageSrc} onChange={(v) => setCustomValue("imageSrc", v)} />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className={styles.bodyContentContainer}>
        <Heading title={t("describeYourSpace")} />
        <Input id="title" label={t("title")} register={register} errors={errors} required />
        <TextArea id="description" label={t("description")} register={register} errors={errors} required />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className={styles.bodyContentContainer}>
        <Heading title={t("setYourPrice")} />
        <Input id="price" label={t("price")} type="number" register={register} errors={errors} required />
      </div>
    );
  }

  return (
    <Modal
      title={t("readyToHostOnRestay")}
      body={<div><div data-ui="hosting-progress"><span>{t("stepOf", { current: step + 1, total: 6 })}</span><progress value={step + 1} max={6} aria-label={t("progress")} /></div>{bodyContent}</div>}
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
