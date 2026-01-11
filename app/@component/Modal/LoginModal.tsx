"use client";

import styles from "./LoginModal.module.css";
import { loginModalAtom, registerModalAtom } from "../../../jotai/@store/state";
import { SubmitHandler, FieldValues, useForm } from "react-hook-form";
import Heading from "../Heading";
import Input from "../Input/Input";
import Modal from "./Modal";
import Button from "../Button";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";

import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { signInWithCredentials, signInWithProvider } from "./auth-actions";

const LoginModal = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const isLoginModal = useAtomValue(loginModalAtom);
  const isRegisterModal = useAtomValue(registerModalAtom);
  const setIsLoginModal = useSetAtom(loginModalAtom);
  const setIsRegisterModal = useSetAtom(registerModalAtom);

  const handleClose = () => {
    setIsLoginModal(!isLoginModal);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);

      const email = data.email as string;
      const password = data.password as string;

      await signInWithCredentials(email, password);

      toast.success("만나서 반가워요!🖐");
      setIsLoginModal(!isLoginModal);

      // ✅ 서버 세션 갱신 반영
      router.refresh();
    } catch (e: any) {
      // credentials 실패 시 signIn이 throw 날 수 있음(구현/환경에 따라)
      toast.error("이메일 혹은 비밀번호를 확인해주세요");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className={styles.bodyContentContainer}>
      <Heading title="Restay에 오신것을 환영합니다." subTitle="이메일,비밀번호를 입력하세요." />

      <Input id={"email"} label={"Email"} type={"email"} disabled={isLoading} register={register} errors={errors} required />
      <Input id={"password"} label={"Password"} type="password" disabled={isLoading} register={register} errors={errors} required />
    </div>
  );

  const onClick = () => {
    setIsLoginModal(!isLoginModal);
    setIsRegisterModal(!isRegisterModal);
  };

  const footerContent = (
    <div className={styles.footerContentContainer}>
      <Button outline label={"Google로 시작하기"} icon={FcGoogle} onClick={() => signInWithProvider("google")} />
      <Button outline label={"Naver으로 시작하기"} icon={"/naverIcon.png"} onClick={() => signInWithProvider("naver")} />
      <Button outline label={"Kakao으로 시작하기"} icon={RiKakaoTalkFill} onClick={() => signInWithProvider("kakao")} />

      <div className={styles.footerTextContainer}>
        <div className={styles.footerTextWraaper}>
          <div>Restay가 처음이신가요?</div>
          <button onClick={onClick} className={styles.footerTextButton}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );

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
  );
};

export default LoginModal;
