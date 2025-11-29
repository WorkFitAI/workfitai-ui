import { ChangeEvent } from "react";

type ShowSelectProps = {
  selectChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  showLimit: number;
};

export default function ShowSelect({ selectChange, showLimit }: ShowSelectProps) {
  return (
    <select onChange={selectChange} value={showLimit}>
      <option value={showLimit}>{showLimit}</option>
      <option value={12}>12</option>
      <option value={16}>16</option>
    </select>
  );
}


