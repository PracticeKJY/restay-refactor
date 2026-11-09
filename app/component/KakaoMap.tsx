"use client";
import { useTranslations } from "next-intl";

import { FC, useState } from "react";
import styles from "./KakaoMap.module.css";
import { Map, MapMarker, MapTypeControl, Roadview, ZoomControl, useKakaoLoader } from "react-kakao-maps-sdk";
import { latlngAtom } from "../../jotai/@store/state";
import { useAtomValue } from "jotai";
import Image from "next/image";

interface KakaoMapProps {
  center?: any;
}

const KakaoMap: FC<KakaoMapProps> = ({ center }) => {
  const t = useTranslations("Common");

  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? "",
    libraries: ["services", "clusterer"],
  });
  const latlng = useAtomValue(latlngAtom);
  const [toggle, setToggle] = useState(false);
  const centerWithRadius = { ...center, radius: 500 };
  const onToggle = () => {
    setToggle(!toggle);
  };

  if (error) return <div role="status" className={styles.mapWrapper}>{t("couldNotLoadTheMap")}</div>;
  if (loading) return <div role="status" className={styles.mapWrapper}>{t("loadingTheMap")}</div>;

  return (
    <>
      <div className={styles.mapContainer}>
        <button className={!toggle ? styles.loadViewButton : styles.loadView} onClick={onToggle}>
          <Image src={!toggle ? "/ic-loadview.png" : "/ic-blue-loadview.png"} alt="" fill />
        </button>

        {!toggle ? (
          <Map className={styles.mapWrapper} center={latlng.lat === 0 && !center ? { lat: 37.5716, lng: 126.9767 } : center ? center : latlng} level={4}>
            <ZoomControl />
            <MapTypeControl />
            <MapMarker position={center ? center : latlng}></MapMarker>
          </Map>
        ) : (
          <Roadview position={center ? centerWithRadius : { lat: 37.5716, lng: 126.9767, radius: 500 }} className={styles.roadViewWrapper} />
        )}
      </div>
    </>
  );
};

export default KakaoMap;
