import React from 'react';
import { Dropdown } from 'primereact/dropdown';

export default function Input({
  placeholder,
  value,
  options,
  onChange,
  filter,
  itemTemplate,
  onBlur,
  name,
  optionGroupTemplate,
  optionGroupChildren,
  optionGroupLabel,
  optionLabel,
  valueTemplate,
  className,
  disabled = false,
}) {
  return (
    <Dropdown
      value={value}
      name={name}
      filter={filter}
      className={className}
      // showClear
      options={options}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      itemTemplate={itemTemplate}
      optionGroupTemplate={optionGroupTemplate}
      optionGroupChildren={optionGroupChildren}
      optionGroupLabel={optionGroupLabel}
      optionLabel={optionLabel}
      valueTemplate={valueTemplate}
      disabled={disabled}
    />
  );
}
