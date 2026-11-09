"use client";

import { useTranslations } from "next-intl";

// Labels are existing DB/filter values. Translate only the visible copy.
export const categoryKeys: Record<string, string> = {
  "해변 근처": "beach", "빌라": "villa", "애견동반": "pets", "섬": "island",
  "호수": "lake", "스키": "ski", "수영장": "pool", "시골": "country",
  "캠핑": "camp", "특별한 시설": "unique", "동굴": "cave", "풍차": "windmill",
};

export function useCategoryCopy() {
  const t = useTranslations("Categories");
  return (label: string, description = false) => {
    const key = categoryKeys[label];
    return key ? t(`${key}.${description ? "description" : "label"}`) : label;
  };
}
