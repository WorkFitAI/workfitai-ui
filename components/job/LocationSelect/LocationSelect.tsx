"use client";

import React from "react";
import Select, { SingleValue } from "react-select";

export interface LocationOption {
  label: string;
  value: string;
}

// Danh sách 34 tỉnh/thành (ví dụ ngắn gọn, bạn có thể thêm đầy đủ)
const LOCATIONS: LocationOption[] = [
  { label: "Hà Nội", value: "Hà Nội" },
  { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
  { label: "Đà Nẵng", value: "Đà Nẵng" },
  { label: "Hải Phòng", value: "Hải Phòng" },
  { label: "Cần Thơ", value: "Cần Thơ" },
  { label: "An Giang", value: "An Giang" },
  { label: "Bà Rịa - Vũng Tàu", value: "Bà Rịa - Vũng Tàu" },
  { label: "Bắc Giang", value: "Bắc Giang" },
  { label: "Bắc Kạn", value: "Bắc Kạn" },
  { label: "Bạc Liêu", value: "Bạc Liêu" },
  { label: "Bắc Ninh", value: "Bắc Ninh" },
  { label: "Bến Tre", value: "Bến Tre" },
  { label: "Bình Định", value: "Bình Định" },
  { label: "Bình Dương", value: "Bình Dương" },
  { label: "Bình Phước", value: "Bình Phước" },
  { label: "Bình Thuận", value: "Bình Thuận" },
  { label: "Cà Mau", value: "Cà Mau" },
  { label: "Cao Bằng", value: "Cao Bằng" },
  { label: "Đắk Lắk", value: "Đắk Lắk" },
  { label: "Đắk Nông", value: "Đắk Nông" },
  { label: "Điện Biên", value: "Điện Biên" },
  { label: "Đồng Nai", value: "Đồng Nai" },
  { label: "Đồng Tháp", value: "Đồng Tháp" },
  { label: "Gia Lai", value: "Gia Lai" },
  { label: "Hà Giang", value: "Hà Giang" },
  { label: "Hà Nam", value: "Hà Nam" },
  { label: "Hà Tĩnh", value: "Hà Tĩnh" },
  { label: "Hải Dương", value: "Hải Dương" },
  { label: "Hòa Bình", value: "Hòa Bình" },
  { label: "Hưng Yên", value: "Hưng Yên" },
  { label: "Khánh Hòa", value: "Khánh Hòa" },
  { label: "Kiên Giang", value: "Kiên Giang" },
  { label: "Kon Tum", value: "Kon Tum" },
  { label: "Lai Châu", value: "Lai Châu" },
  { label: "Lâm Đồng", value: "Lâm Đồng" },
  { label: "Lạng Sơn", value: "Lạng Sơn" },
  { label: "Lào Cai", value: "Lào Cai" },
  { label: "Long An", value: "Long An" },
];

interface LocationSelectProps {
  value: string;
  onChange: (val: string) => void;
}

const LocationSelect: React.FC<LocationSelectProps> = ({ value, onChange }) => {
  return (
    <Select<LocationOption, false>
      options={LOCATIONS}
      value={LOCATIONS.find((opt) => opt.value === value) || null}
      onChange={(selected: SingleValue<LocationOption>) =>
        onChange(selected ? selected.value : "")
      }
      placeholder="Select location..."
    />
  );
};

export default LocationSelect;
