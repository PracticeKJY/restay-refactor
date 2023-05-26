"use client"
import { useEffect, useState } from "react"
import styles from "./LoginModal.module.css"
import { useLoginModal } from "@/pages/@recoil/store/state"
import { useRecoilState } from "recoil"
import { SubmitHandler, FieldValues, useForm } from "react-hook-form"
import Heading from "../Heading"
import Input from "../Input/Input"
import Modal from "./Modal"
import Button from "../Button"
import { FcGoogle } from "react-icons/fc"
import { AiFillGithub } from "react-icons/ai"
import { RiKakaoTalkFill } from "react-icons/ri"

const LoginModal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoginModal, isSetLoginModal] = useRecoilState(useLoginModal)
  const handleClose = () => {
    isSetLoginModal(!isLoginModal)
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldValues>()

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data)
    setIsLoading(true)
  }

  const bodyContent = (
    <>
      <div className={styles.bodyContentContainer}>
        <Heading
          title="Restay에 온걸 환영합니다."
          subTitle="이메일,비밀번호를 입력하세요."
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
        <Button
          outline
          label={"Google로 시작하기"}
          icon={FcGoogle}
          onClick={() => {}}
        />
        <Button
          outline
          label={"Github로 시작하기"}
          icon={AiFillGithub}
          onClick={() => {}}
        />
        <Button
          outline
          label={"Naver으로 시작하기"}
          icon={"/naverIcon.png"}
          onClick={() => {}}
        />
        <Button
          outline
          label={"Kakao으로 시작하기"}
          icon={RiKakaoTalkFill}
          onClick={() => {}}
        />
        <div className={styles.footerTextContainer}>
          <div className={styles.footerTextWraaper}>
            <div>Restay이 처음이신가요?</div>
            <button onClick={() => {}} className={styles.footerTextButton}>
              회원가입
            </button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <Modal
      isOpen={isLoginModal}
      onClose={handleClose}
      disabled={isLoading}
      title={"로그인"}
      actionLabel={"로그인"}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default LoginModal
