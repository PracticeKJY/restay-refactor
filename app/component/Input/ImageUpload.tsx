import styles from "./ImageUpload.module.css";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { TbPhotoPlus } from "react-icons/tb";
import { FC, useCallback, useState } from "react";
import { useTranslations } from "next-intl";

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  onChange: (images: string[]) => void;
  value: string[];
}

const ImageUpload: FC<ImageUploadProps> = ({ onChange, value }) => {
  const t = useTranslations("Hosting");
  const [images, setImages] = useState<string[]>(value || []);
  const handleUpload = useCallback(
    (result: any) => {
      const newImage = result.info.secure_url;
      setImages((prevImages) => [...prevImages, newImage]);
      onChange([...images, newImage]);
    },
    [onChange, images],
  );

  const handleDelete = (indexToDelete: number) => {
    // 선택한 이미지를 제외한 나머지를 배열에서 가져오기
    const newImages = images.filter((_, index) => index !== indexToDelete);
    setImages(newImages);
    onChange(newImages);
  };

  return (
    <>
      <CldUploadWidget
        onUpload={handleUpload}
        uploadPreset="x8nx2u3v"
        options={{
          maxFiles: 4,
          maxImageWidth: 300,
          minImageHeight: 300,
          maxImageHeight: 300,
        }}>
        {({ open }) => {
          return (
            <button data-ui="image-upload" type="button" onClick={() => open?.()} className={styles.container}>
              <TbPhotoPlus size={50} />
              <span className={styles.imageUploadText}>{t("uploadPhotos")}</span>
            </button>
          );
        }}
      </CldUploadWidget>
      <div className={styles.uploadImageContainer}>
        {images.map((image, index) => (
          <div key={index} className={styles.uploadImageWrapper}>
            <Image alt={t("uploadedPhoto", { number: index + 1 })} width={100} height={100} style={{ objectFit: "cover" }} src={image} />
            <button type="button" aria-label={t("removePhoto", { number: index + 1 })} className={styles.deleteButton} onClick={() => handleDelete(index)}>×</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ImageUpload;
