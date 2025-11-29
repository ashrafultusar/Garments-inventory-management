import Select from "react-select";

const SearchableSelect = ({ id, value, onChange, options, placeholder }) => {
  return (
    <Select
      id={id}
      value={options.find((opt) => opt.value === value)}
      onChange={(selected) => onChange({ target: { id, value: selected.value } })}
      options={options}
      placeholder={placeholder}
      isSearchable
      className="text-black"
    />
  );
};

export default SearchableSelect;
