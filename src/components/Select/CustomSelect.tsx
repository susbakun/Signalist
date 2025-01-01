import { OptionType } from "@/shared/types"
import { isDarkMode } from "@/utils"
import Select from "react-select"

type CustomSelectProps = {
  options: OptionType[]
  onChange: (selected: OptionType | null) => void
  selected: string
}

export const CustomSelect = ({ options, onChange, selected }: CustomSelectProps) => {
  if (isDarkMode())
    return (
      <Select
        options={options}
        value={options.find((opt) => opt.value === selected)}
        onChange={onChange}
        theme={(theme) => ({
          ...theme,
          borderRadius: 8,
          colors: {
            ...theme.colors,
            primary25: "#374151", // Dark gray for hover background
            primary: "#10b981", // Green for selected or focused
            neutral0: "#1f2937", // Dark background for control and menu
            neutral80: "#f9fafb", // Light text color
            neutral20: "#4b5563", // Border color for control
            neutral30: "#10b981" // Border color on hover/focus
          }
        })}
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: "#1f2937", // Dark background
            borderColor: state.isFocused ? "#10b981" : "#4b5563", // Green or dark gray
            color: "#f9fafb", // Light text color
            boxShadow: "none", // Removes the box shadow completely
            "&:hover": {
              borderColor: "#10b981"
            },
            "&:focus": {
              outline: "none" // Removes the blue ring
            },
            input: {
              "&:focus": {
                boxShadow: "none" // Removes the blue ring
              }
            }
          }),
          singleValue: (base) => ({
            ...base,
            color: "#f9fafb" // Light text color
          }),
          placeholder: (base) => ({
            ...base,
            color: "#9ca3af" // Muted light gray for placeholder
          }),
          option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected
              ? "#10b981" // Green for selected
              : isFocused
                ? "#374151" // Dark gray for hover
                : "#1f2937", // Dark background for unselected
            color: isSelected ? "#ffffff" : "#f9fafb", // White for selected, light for unselected
            "&:active": {
              backgroundColor: "#065f46" // Dark green on active
            }
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#1f2937", // Dark menu background
            borderRadius: 8,
            zIndex: 10
          }),
          menuList: (base) => ({
            ...base,
            padding: 0
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: "#9ca3af", // Light gray for dropdown indicator
            "&:hover": {
              color: "#10b981" // Green on hover
            }
          }),
          clearIndicator: (base) => ({
            ...base,
            color: "#9ca3af", // Light gray for clear indicator
            "&:hover": {
              color: "#10b981" // Green on hover
            }
          })
        }}
      />
    )
  else
    return (
      <Select
        options={options}
        value={options.find((opt) => opt.value === selected)}
        onChange={onChange}
        theme={(theme) => ({
          ...theme,
          borderRadius: 8,
          colors: {
            ...theme.colors,
            primary25: "#f3f4f6", // Light gray for hover
            primary: "#10b981", // Green for selected/focused
            neutral0: "#ffffff", // White background
            neutral80: "#111827", // Dark text
            neutral20: "#d1d5db", // Light border
            neutral30: "#10b981" // Green border on hover
          }
        })}
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: "#ffffff",
            borderColor: state.isFocused ? "#10b981" : "#d1d5db",
            color: "#111827",
            boxShadow: "none",
            "&:hover": {
              borderColor: "#10b981"
            },
            "&:focus": {
              outline: "none"
            },
            input: {
              "&:focus": {
                boxShadow: "none"
              }
            }
          }),
          singleValue: (base) => ({
            ...base,
            color: "#111827"
          }),
          placeholder: (base) => ({
            ...base,
            color: "#6b7280"
          }),
          option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected ? "#10b981" : isFocused ? "#f3f4f6" : "#ffffff",
            color: isSelected ? "#ffffff" : "#111827",
            "&:active": {
              backgroundColor: "#059669"
            }
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#ffffff",
            borderRadius: 8,
            zIndex: 10
          }),
          menuList: (base) => ({
            ...base,
            padding: 0
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: "#6b7280",
            "&:hover": {
              color: "#10b981"
            }
          }),
          clearIndicator: (base) => ({
            ...base,
            color: "#6b7280",
            "&:hover": {
              color: "#10b981"
            }
          })
        }}
      />
    )
}
