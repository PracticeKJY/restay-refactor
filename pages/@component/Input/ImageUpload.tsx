"use client"

import styles from "./ImageUpload.module.css"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { TbPhotoPlus } from "react-icons/tb"
import { FC, useCallback } from "react"

declare global {
  var cloudinary: any
}

interface ImageUploadProps {
  onChange: (value: string) => void
  value: string
}

const ImageUpload: FC<ImageUploadProps> = ({ onChange, value }) => {
  const handleUpload = useCallback(
    (result: any) => {
      onChange(result.info.secure_url)
    },
    [onChange],
  )

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="x8nx2u3v"
      options={{
        maxFiles: 1,
      }}
    >
      {({ open }) => {
        return (
          <div onClick={() => open?.()} className={styles.container}>
            <TbPhotoPlus size={50} />
            <div className={styles.imageUploadText}>click to Upload</div>
            {value && (
              <div className={styles.imagesWrapper}>
                <Image
                  alt="upload"
                  fill
                  style={{ objectFit: "cover" }}
                  src={value}
                />
              </div>
            )}
          </div>
        )
      }}
    </CldUploadWidget>
  )
}

export default ImageUpload
