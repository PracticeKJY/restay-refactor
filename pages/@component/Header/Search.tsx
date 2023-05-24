"use client"

import styles from "./Search.module.css"
import { BiSearch } from "react-icons/bi"

const Search = () => {
  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <div className={styles.searchText}>{"Anywhere 어디든지"}</div>
        <div className={styles.searchText}>{"Any Week 언제든지"}</div>
        <div className={styles.addGuest}>{"add Guest"}</div>
        <div className={styles.biSearchContainer}>
          <BiSearch size={18}/>
        </div>
      </div>
    </div>
  )
}

export default Search
