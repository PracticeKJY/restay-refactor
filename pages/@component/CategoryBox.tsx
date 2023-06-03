"use client"

import styles from "./CategoryBox.module.css"
import { useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"
import { FC, useCallback } from "react"
import { IconType } from "react-icons"

interface CategoryBoxProps {
  label: string
  icon: IconType
  selected?: boolean
}

const CategoryBox: FC<CategoryBoxProps> = ({ icon: Icon, label, selected }) => {
  const router = useRouter()
  const params = useSearchParams()

  const handleClick = useCallback(() => {
    let currentQuery = {}

    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    const updatedQuery: any = {
      ...currentQuery,
      category: label,
    }

    if (params?.get("category") === label) {
      delete updatedQuery.category
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true },
    )

    router.push(url)
  }, [params, label, router])

  return (
    <div onClick={handleClick} className={styles.container}>
      <Icon size={26} />
      <div className={styles.labelWrapper}>{label}</div>
    </div>
  )
}

export default CategoryBox
