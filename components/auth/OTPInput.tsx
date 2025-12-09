"use client";

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

const OTPInput = ({
  length = 6,
  value = "",
  onChange,
  disabled = false,
  error = false,
  autoFocus = false,
}: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize state from prop value
  useEffect(() => {
    const otpArray = value.split("").slice(0, length);
    // Pad with empty strings if needed
    while (otpArray.length < length) {
      otpArray.push("");
    }
    setOtp(otpArray);
  }, [value, length]);

  useEffect(() => {
    // Focus first input on mount if autoFocus is true
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (index: number, val: string) => {
    if (disabled) return;

    // Only allow digits
    const digit = val.replace(/\D/g, "");

    // If user typed multiple digits (e.g. android autocomplete), take only the last one
    const lastDigit = digit.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = lastDigit;

    const otpString = newOtp.join("");
    setOtp(newOtp);
    onChange(otpString);

    // Move to next input if digit entered
    if (lastDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        // If current has value, clear it but don't move focus yet (next backspace will move)
        // This logic is handled by onChange normally, but let's be explicit
      }
    }

    // Move to previous input on left arrow
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    // Move to next input on right arrow
    if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const digits = pastedData.replace(/\D/g, "").slice(0, length);

    if (digits) {
      const newOtp = [...otp];
      const chars = digits.split("");

      chars.forEach((char, i) => {
        if (i < length) {
          newOtp[i] = char;
        }
      });

      const otpString = newOtp.join("");
      setOtp(newOtp);
      onChange(otpString);

      // Focus the next empty input or the last input
      const nextIndex = Math.min(chars.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="otp-input-container mb-30">
      <div className="d-flex justify-content-center gap-2 otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`form-control text-center ${error ? "is-invalid" : ""}`}
            style={{ width: "48px", height: "48px", fontSize: "20px", padding: "0" }}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
      {error && <div className="text-danger text-center mt-2">Invalid OTP code</div>}
    </div>
  );
};

export default OTPInput;
