import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerFieldProps {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  required?: boolean;
}

export function DatePickerField({
  label,
  value,
  onChange,
  required,
}: DatePickerFieldProps) {
  // convert string YYYY-MM-DD -> Date object
  const selectedDate = value ? new Date(value) : null;

  return (
    <div className="d-flex align-items-space justify-content-end flex-column">
      <label className="form-label">
        {label} {required && <span className="text-danger"> *</span>}
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) =>
          onChange(date ? date.toISOString().split("T")[0] : "")
        }
        dateFormat="yyyy-MM-dd"
        className="form-control"
        placeholderText="Select a date"
        required={required}
      />
    </div>
  );
}
