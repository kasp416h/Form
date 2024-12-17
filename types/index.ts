import { formHelpers } from "../helpers";

export type SelectOption = {
  value: string;
  label: string;
  itemClassName?: string;
};
export type MultiSelectOption = { value: string; label: string };
export type RadioOption = { value: string; label: string };

export type FormHelpers = keyof typeof formHelpers;

export type ControlType =
  | React.HTMLInputTypeAttribute
  | "textarea"
  | "select"
  | "multi-select"
  | "radio"
  | "otp";
