"use client"
import { useTranslations } from "next-intl";


import { useState } from "react"
import Modal from "./Modal"
import styles from "./RegisterModal.module.css"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Heading from "../Heading"
import Input from "../Input/Input"
import { loginModalAtom, registerModalAtom } from "../../../jotai/@store/state"
import axios from "axios"
import toast from "react-hot-toast"
import { useAtomValue, useSetAtom } from "jotai"

const RegisterModal = () => {
  const t = useTranslations("Auth");

  const [isLoading, setIsLoading] = useState(false)
  const isRegisterModal = useAtomValue(registerModalAtom)
  const isLoginModal = useAtomValue(loginModalAtom)
  const setIsRegisterModal = useSetAtom(registerModalAtom)
  const setIsLoginModal = useSetAtom(loginModalAtom)

  const handleClose = () => {
    setIsRegisterModal(!isRegisterModal)
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    axios
      .post("/api/auth/signup", data)
      .then(() => {
        toast.success(t("welcomeToRestay2"))
      })
      .catch((error) => {
        console.log(error)
        toast.error(t("somethingWentWrong"))
      })
      .finally(() => {
        setIsLoading(false)
        setIsRegisterModal(!isRegisterModal)
      })
  }

  const onClick = () => {
    setIsLoginModal(!isLoginModal)
    setIsRegisterModal(!isRegisterModal)
  }

  const bodyContent = (
    <>
      <div className={styles.bodyContentContainer}>
        <Heading
          title={t("welcomeToRestay")}
          subTitle={t("joinRestayAndEnjoyMemberBenefits")}
        />
        <Input
          id={"email"}
          label={"Email"}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id={"name"}
          label={"Name"}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id={"password"}
          label={"Password"}
          type="password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    </>
  )

  const footerContent = (
    <>
      <div className={styles.footerContentContainer}>
        <div className={styles.footerTextContainer}>
          <div className={styles.footerTextWraaper}>
            <div>{t("alreadyHaveAnAccount")}</div>
            <button onClick={onClick} className={styles.footerTextButton}>
              {t("logIn")}</button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <Modal
      isOpen={isRegisterModal}
      onClose={handleClose}
      disabled={isLoading}
      title={t("signUp")}
      actionLabel={t("signUp")}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default RegisterModal
