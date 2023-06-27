"use client"
import { FC } from "react"
import styles from "./KakaoMap.module.css"
import { Map, MapMarker } from "react-kakao-maps-sdk"
import { latlngAtom } from "../../jotai/@store/state"
import { useAtomValue } from "jotai"

interface KakaoMapProps {
  center?: any
}

const KakaoMap: FC<KakaoMapProps> = ({ center }) => {
  const latlng = useAtomValue(latlngAtom)

  return (
    <>
      <div className={styles.mapContainer}>
        <Map
          className={styles.mapContainer}
          center={
            latlng.lat === 0 && !center
              ? { lat: 37.5716, lng: 126.9767 }
              : center
              ? center
              : latlng
          }
          level={4}
        >
          <MapMarker position={center ? center : latlng}></MapMarker>
        </Map>
      </div>
    </>
  )
}

export default KakaoMap
