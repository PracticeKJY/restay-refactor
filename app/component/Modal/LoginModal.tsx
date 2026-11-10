"use client";
import { useTranslations } from "next-intl";


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
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { signInWithCredentials, signInWithProvider } from "./auth-actions";

const LoginModal = () => {
  const t = useTranslations("Auth");

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

      toast.success(t("welcomeBack"));
      setIsLoginModal(!isLoginModal);

      // ✅ 서버 세션 갱신 반영
      router.refresh();
    } catch (e: any) {
      // credentials 실패 시 signIn이 throw 날 수 있음(구현/환경에 따라)
      toast.error(t("pleaseCheckYourEmailOrPassword"));
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div data-ui="auth-body" className={styles.bodyContentContainer}>
      <Heading as="h2" title={t("welcomeToRestay")} subTitle={t("enterYourEmailAndPassword")} />

      <Input id={"email"} label={t("email")} autoComplete="email" type={"email"} disabled={isLoading} register={register} errors={errors} required />
      <Input id={"password"} label={t("password")} autoComplete="current-password" type="password" disabled={isLoading} register={register} errors={errors} required />
    </div>
  );

  const onClick = () => {
    setIsLoginModal(!isLoginModal);
    setIsRegisterModal(!isRegisterModal);
  };

  const footerContent = (
    <div data-ui="auth-footer" className={styles.footerContentContainer}>
      <div data-ui="auth-divider">{t("orContinueWith")}</div>
      <Button outline label={t("continueWithGoogle")} icon={FcGoogle} onClick={() => signInWithProvider("google")} />
      <Button outline label={t("continueWithNaver")} icon={"/naverIcon.png"} onClick={() => signInWithProvider("naver")} />
      <Button outline label={t("continueWithKakao")} icon={RiKakaoTalkFill} onClick={() => signInWithProvider("kakao")} />

      <div data-ui="auth-switch" className={styles.footerTextContainer}>
        <div className={styles.footerTextWraaper}>
          <div>{t("newToRestay")}</div>
          <button onClick={onClick} className={styles.footerTextButton}>
            {t("signUp")}</button>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isLoginModal}
      onClose={handleClose}
      disabled={isLoading}
      title={t("logIn")}
      actionLabel={t("logIn")}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
