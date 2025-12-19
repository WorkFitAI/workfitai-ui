import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Cài đặt: npm install react-icons
import { HiOutlineCalendar } from "react-icons/hi";

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
  const selectedDate = value ? new Date(value) : null;

  return (
    <div className="mb-2">
      <label className="form-label fw-bold small text-muted text-uppercase mt-2 mb-2">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <div className="position-relative custom-datepicker-container">
        {/* Icon từ react-icons */}
        <div
          className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
          style={{
            zIndex: 10,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <HiOutlineCalendar size={20} />
        </div>

        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) =>
            onChange(date ? date.toISOString().split("T")[0] : "")
          }
          dateFormat="yyyy-MM-dd"
          // ps-5 (padding-start) để đẩy chữ qua phải, nhường chỗ cho icon
          className="form-control ps-5 py-2 shadow-none border-secondary-subtle"
          placeholderText="Select a date"
          required={required}
          showPopperArrow={false}
        />
      </div>

      <style jsx global>{`
        /* Đảm bảo DatePicker chiếm 100% chiều rộng của container */
        .custom-datepicker-container .react-datepicker-wrapper {
          display: block;
          width: 100%;
        }
        .custom-datepicker-container .react-datepicker__input-container {
          display: block;
        }
        /* Làm đẹp khung lịch popup */
        .react-datepicker {
          border-radius: 12px !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          font-family: inherit !important;
          overflow: hidden;
        }
        .react-datepicker__header {
          background-color: #fff !important;
          border-bottom: 1px solid #f3f4f6 !important;
          padding-top: 12px !important;
        }
        .react-datepicker__day--selected {
          background-color: #7f56d9 !important;
          border-radius: 6px !important;
        }
        .react-datepicker__day:hover {
          border-radius: 6px !important;
        }
      `}</style>
    </div>
  );
}
