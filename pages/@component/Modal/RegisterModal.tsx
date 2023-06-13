"use client"

import { useState } from "react"
import Modal from "./Modal"
import styles from "./RegisterModal.module.css"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Heading from "../Heading"
import Input from "../Input/Input"
import { loginModalAtom, registerModalAtom } from "@/pages/@jotai/store/state"
import axios from "axios"
import toast from "react-hot-toast"
import { useAtomValue, useSetAtom } from "jotai"

const RegisterModal = () => {
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
        toast.success("restay의 회원이 되신걸 환영해요")
      })
      .catch((error) => {
        console.log(error)
        toast.error("Something went wrong")
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
          title="Restay에 오신것을 환영합니다."
          subTitle="Restay의 회원이 되시고 혜택을 받아가세요"
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
            <div>이미 계정이 있으신가요?</div>
            <button onClick={onClick} className={styles.footerTextButton}>
              로그인
            </button>
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
      title={"회원가입"}
      actionLabel={"회원가입"}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default RegisterModal
