import { OptionType } from "@/shared/types";
import Select from "react-select";


type CustomSelectProps = {
    options: OptionType[]
    onChange: (selected: OptionType | null) => void
    selected: string
}

export const CustomSelect = ({options, onChange, selected} : CustomSelectProps) => {
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
                primary: "#10b981",  // Green for selected or focused
                neutral0: "#1f2937", // Dark background for control and menu
                neutral80: "#f9fafb", // Light text color
                neutral20: "#4b5563", // Border color for control
                neutral30: "#10b981", // Border color on hover/focus
            },
        })}
        styles={{
            control: (base, state) => ({
                ...base,
                backgroundColor: "#1f2937", // Dark background
                borderColor: state.isFocused ? "#10b981" : "#4b5563", // Green or dark gray
                color: "#f9fafb", // Light text color
                boxShadow: "none", // Removes the box shadow completely
                "&:hover": {
                    borderColor: "#10b981",
                },
                "&:focus": {
                    outline: "none", // Removes the blue ring
                },
                input: {
                    "&:focus": {
                        boxShadow: "none", // Removes the blue ring
                    },
                },
            }),
            singleValue: (base) => ({
                ...base,
                color: "#f9fafb", // Light text color
            }),
            placeholder: (base) => ({
                ...base,
                color: "#9ca3af", // Muted light gray for placeholder
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
                    backgroundColor: "#065f46", // Dark green on active
                },
            }),
            menu: (base) => ({
                ...base,
                backgroundColor: "#1f2937", // Dark menu background
                borderRadius: 8,
                zIndex: 10,
            }),
            menuList: (base) => ({
                ...base,
                padding: 0,
            }),
            dropdownIndicator: (base) => ({
                ...base,
                color: "#9ca3af", // Light gray for dropdown indicator
                "&:hover": {
                    color: "#10b981", // Green on hover
                },
            }),
            clearIndicator: (base) => ({
                ...base,
                color: "#9ca3af", // Light gray for clear indicator
                "&:hover": {
                    color: "#10b981", // Green on hover
                },
            }),
        }}
    />
)
}
