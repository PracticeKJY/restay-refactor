"use client"
import { useTranslations } from "next-intl";


import { forwardRef, useEffect, useRef, useState } from "react"
import styles from "./Search.module.css"
import { BiSearch } from "react-icons/bi"
import { TiTimes } from "react-icons/ti"
import { categories } from "./Categories"
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation"
import qs from "query-string"
import { useCallback } from "react"
import { Link } from "@/i18n/navigation"
import { useCategoryCopy } from "@/i18n/useCategoryCopy"

const Search = () => {
  const t = useTranslations("Navigation");

  const [inputText, setInputText] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)
  const recommendSearchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!searchRef.current || !recommendSearchRef.current) {
        return
      }

      if (
        !searchRef.current.contains(event.target) &&
        !recommendSearchRef.current.contains(event.target)
      ) {
        setShowModal(false)
      }
    }

    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const router = useRouter()
  const params = useSearchParams()

  const handleInputChange = (e: any) => {
    setInputText(e.target.value)
  }

  const onSubmit = useCallback(
    (e: any) => {
      e.preventDefault()

      let currentQuery = {}

      if (params) {
        currentQuery = qs.parse(params.toString())
      }

      const updatedQuery: any = {
        ...currentQuery,
        category: inputText,
      }

      if (updatedQuery.category === "") {
        alert(t("pleaseEnterASearchTerm"))
      }

      const url = qs.stringifyUrl(
        {
          url: "/",
          query: updatedQuery,
        },
        { skipNull: true },
      )

      router.push(url)
      setShowModal(false)
      setInputText("")
    },
    [params, inputText, router, t],
  )

  const onClick = () => {
    setShowModal(false)
    setShowSearch(!showSearch)
    setInputText("")
  }

  return (
    <div className={styles.container}>
      {!showSearch ? (
        <div className={styles.searchWrapper}>
          <div className={styles.searchText} onClick={onClick}>
            {t("anywhereAnytime")} <span>Restay</span>{t("whereWillYouGoNext")}</div>
          <button
            aria-label={t("search")}
            className={styles.biSearchWrapper}
            onClick={onClick}
          >
            <BiSearch size={18} />
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className={styles.searchWrapper}>
          <label htmlFor="search"></label>
          <input
            id="search"
            ref={searchRef}
            className={styles.input}
            type="text"
            value={inputText}
            placeholder={t("enterAKeywordForYourNextDestination")}
            aria-label={t("search")}
            onFocus={() => setShowModal(true)}
            onChange={handleInputChange}
          />
          <button
            className={styles.biSearchWrapper}
            type="button"
            onClick={onClick}
            aria-label={t("search")}
          >
            <TiTimes size={18} />
          </button>
        </form>
      )}

      {showModal && (
        <RecommendSearch setShowModal={setShowModal} ref={recommendSearchRef} />
      )}
    </div>
  )
}

export default Search

interface RecommendSearchProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const RecommendSearch = forwardRef<HTMLDivElement, RecommendSearchProps>(
  ({ setShowModal }, ref) => {
  const t = useTranslations("Navigation");
  const categoryCopy = useCategoryCopy();

    return (
      <div className={styles.recommendSearchContainer} ref={ref}>
        <div className={styles.test}>
          <div className={styles.recommendSearchWrapper}>
            <div className={styles.absolute}>
              <div className={styles.recommendSearchTitle}>{t("suggestedSearches")}</div>
              <ul className={styles.recommendSearchListWrapper}>
                {categories.map((data, index) => {
                  return (
                    <li key={index}>
                      <Link
                        href={`/?category=${data.label}`}
                        className={styles.recommendSearchList}
                        onClick={() => setShowModal(false)}
                      >
                        {categoryCopy(data.label)}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

RecommendSearch.displayName = "RecommendSearch"
