"use client";
import React from "react";
import { Dropdown } from "react-bootstrap";
import styles from "./scss/ShowDropdown.module.scss";

interface FilterDropdownProps<T> {
  label: string;
  value: T;
  options: T[];
  onChange: (val: T) => void;
}

export default function FilterDropdown<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps<T>) {
  return (
    <div className={styles.showDropdownWrapper}>
      <span className={styles.showLabel}>{label}</span>
      <Dropdown>
        <Dropdown.Toggle className={styles.showDropdownToggle}>
          {value}
        </Dropdown.Toggle>
        <Dropdown.Menu className={styles.showDropdownMenu}>
          {options.map((option) => (
            <Dropdown.Item
              key={option}
              active={option === value}
              onClick={() => onChange(option)}
            >
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
