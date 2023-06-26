"use client"

import { forwardRef, useEffect, useRef, useState } from "react"
import styles from "./Search.module.css"
import { BiSearch } from "react-icons/bi"
import { TiTimes } from "react-icons/ti"
import { categories } from "./Categories"
import { useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"
import { useCallback } from "react"
import Link from "next/link"

const Search = () => {
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
        alert("검색어를 입력해주세요.")
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
    [params, inputText, router],
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
          <div className={styles.searchText}>
            어디든지, 언제든지 <span>Restay</span>와 함께 떠나보는 건 어떨까요?
          </div>
          <button className={styles.biSearchWrapper} onClick={onClick}>
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
            placeholder="떠나고 싶은 곳의 키워드를 적어주세요."
            onFocus={() => setShowModal(true)}
            onChange={handleInputChange}
          />
          <button
            className={styles.biSearchWrapper}
            type="button"
            onClick={onClick}
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
    return (
      <div className={styles.recommendSearchContainer} ref={ref}>
        <div className={styles.test}>
          <div className={styles.recommendSearchWrapper}>
            <div className={styles.absolute}>
              <div className={styles.recommendSearchTitle}>추천 검색어</div>
              <ul className={styles.recommendSearchListWrapper}>
                {categories.map((data, index) => {
                  return (
                    <li key={index}>
                      <Link
                        href={`/?category=${data.label}`}
                        className={styles.recommendSearchList}
                        onClick={() => setShowModal(false)}
                      >
                        {data.label}
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
