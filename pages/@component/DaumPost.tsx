"use client";

import styles from "./DaumPost.module.css";

import axios from "axios";
import { useSetAtom } from "jotai";
import { latlngAtom } from "../../jotai/@store/state";
import { FC, useState } from "react";
import DaumPostCode from "react-daum-postcode";

interface DaumPostProps {
  value?: string;
  onChange: (value: any) => void;
}

const DaumPost: FC<DaumPostProps> = ({ value, onChange }) => {
  const setLatlng = useSetAtom(latlngAtom);
  const [showModal, setShowModal] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;

  const handleComplete = async (data: any) => {
    try {
      let fullAddress = data.address;
      let extraAddress = "";

      if (data.addressType === "R") {
        if (data.bname !== "") {
          extraAddress += data.bname;
        }
        if (data.buildingName !== "") {
          extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
      }

      const config = {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      };

      const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${fullAddress}`; // REST API url에 data.address값 전송
      const response = await axios.get(url, config);
      const latlng = {
        lat: response.data.documents[0].y,
        lng: response.data.documents[0].x,
      };
      setLatlng(latlng);
      onChange(response.data.documents[0]?.address_name);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        onFocus={() => setShowModal(true)}
        value={value || ""}
        onChange={(value) => {
          onChange(value);
        }}
        placeholder="클릭하시고 주소를 입력해주세요."
      />
      {showModal && (
        <div className={styles.daumPostWrapper}>
          <DaumPostCode
            onComplete={handleComplete}
            onClose={() => {
              setShowModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
};
export default DaumPost;
