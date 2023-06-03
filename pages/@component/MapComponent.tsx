"use client"
import styles from "./MapComponent.module.css"

import { FC } from "react"
import L from "leaflet"
import { MapContainer, Marker, TileLayer } from "react-leaflet"

import "leaflet/dist/leaflet.css"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
})

interface MapComponentProps {
  center?: number[]
}

const MapComponent: FC<MapComponentProps> = ({ center }) => {
  return (
    <MapContainer
      center={(center as L.LatLngExpression) || [51, -0.09]}
      zoom={center ? 8 : 4}
      scrollWheelZoom={true}
      className={styles.mapContainer}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {center && <Marker position={center as L.LatLngExpression} />}
    </MapContainer>
  )
}

export default MapComponent

// marker를 직접 클릭으로 표시하는 코드
// 1. 'react-leaflet'에 useMapEvents 추가
// 2. <AddMarkerOnClick/> 만든 후, 추가
// const [markerPosition, setMarkerPosition] = useState<L.LatLngExpression | null>(null)
//
// const AddMarkerOnClick = () => {
//   useMapEvents({
//     click: (e) => {
//       setMarkerPosition(e.latlng)
//     },
//   })

//   return markerPosition === null ? null : <Marker position={markerPosition} />
// }
