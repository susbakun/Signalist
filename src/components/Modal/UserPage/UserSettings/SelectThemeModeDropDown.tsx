import { ThemeModeType } from "@/shared/types"
import { useEffect, useRef, useState } from "react"

type SelectThemeModeDropDownProps = {
  label: ThemeModeType
  options: ThemeModeType[]
  onSelect: (themeMode: ThemeModeType) => void
}

export const SelectThemeModeDropDown = ({
  label,
  options,
  onSelect
}: SelectThemeModeDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", closeDropdown)
    return () => document.removeEventListener("mousedown", closeDropdown)
  }, [])

  const handleSelect = (themeMode: ThemeModeType) => {
    onSelect(themeMode)
    setIsOpen(false)
  }

  return (
    <div className="absolute right-8" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md shadow-sm px-4 py-2 
          dark:bg-dark-link-button text-sm font-medium focus:outline-none 
          hover:dark:bg-dark-link-button/80 transition-all duration-200 ease-out
          bg-primary-link-button hover:bg-primary-link-button/80 text-white"
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {label}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1
              1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 w-56 rounded-lg
          bg-white dark:bg-gray-800 z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div>
            {options.map((option) => (
              <button
                key={option}
                className="block px-4 py-2 text-sm dark:text-white 
                dark:bg-gray-800 w-full text-left dark:hover:bg-gray-600
                bg-white text-gray-700 hover:bg-gray-200 rounded-lg"
                role="menuitem"
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
