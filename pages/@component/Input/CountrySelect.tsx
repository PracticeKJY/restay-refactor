"use client"

import styles from "./CountrySelect.module.css"
import useCountries from "@/pages/@hooks/useCountries"
import { CSSProperties, FC } from "react"
import Select from "react-select"

export type CountrySelectValue = {
  flag: string
  label: string
  latlng: number[]
  region: string
  value: string
}

interface CountrySelectProps {
  value?: CountrySelectValue
  onChange: (value: CountrySelectValue) => void
}

const countrySelectContainer: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "0.75rem",
}

const regionWrapper: CSSProperties = {
  color: "#737373",
  marginLeft: "0.25rem",
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    padding: "0.75rem",
    borderWidth: "2px",
  }),
  input: (provided: any) => ({
    ...provided,
    fontSize: "1.125rem",
  }),
  option: (provided: any) => ({
    ...provided,
    fontSize: "1.125rem",
  }),
}

const CountrySelect: FC<CountrySelectProps> = ({ value, onChange }) => {
  const { getAll } = useCountries()

  return (
    <div>
      <Select
        placeholder="Anywhere"
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as CountrySelectValue)}
        formatOptionLabel={(option: any) => (
          <div style={countrySelectContainer}>
            <div>{option.flag}</div>
            <div>
              {option.label},<span style={regionWrapper}>{option.region}</span>
            </div>
          </div>
        )}
        // classNames={{
        //   control: ()=> "text-lg",
        //   input: () => "text-lg",
        //   option: () => "text-lg",
        // }}
        classNamePrefix="my-select"
        styles={customStyles}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#ffe4e6",
          },
        })}
      />
    </div>
  )
}

export default CountrySelect
