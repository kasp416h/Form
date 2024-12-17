"use client";
import React, { memo } from "react";

import {
  InputOTP as InputOTPUi,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

interface InputOTPProperties {
  maxLength: number;
  pattern: string;
  value: string;
  onChange: (value: string) => void;
  [key: string]: unknown;
}

function InputOTP({ maxLength, pattern, value, onChange }: InputOTPProperties) {
  const handleChange = (value: string) => {
    onChange(value);
  };

  pattern ??= "REGEXP_ONLY_DIGITS_AND_CHARS";

  return (
    <InputOTPUi
      maxLength={maxLength}
      pattern={
        pattern === "REGEXP_ONLY_DIGITS_AND_CHARS"
          ? REGEXP_ONLY_DIGITS_AND_CHARS
          : pattern
      }
      value={value}
      onChange={handleChange}
    >
      <InputOTPGroup className="w-full">
        {Array.from({ length: maxLength }, (_, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            className="aspect-square h-auto w-1/6"
          />
        ))}
      </InputOTPGroup>
    </InputOTPUi>
  );
}

const MemorizedInputOTP = memo(InputOTP);

export default MemorizedInputOTP;
