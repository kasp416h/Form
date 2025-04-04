import {
  ControlType,
  FormHelpers,
  MultiSelectOption,
  RadioOption,
  SelectOption,
} from "./index";

export interface CheckboxProperties {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface CommonControlProperties
  extends React.HTMLAttributes<HTMLInputElement> {
  group?: string;
  name: string;
  type?: ControlType;
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  onFormBlur?: FormHelpers | ((data: string) => string);
  wrapperClassName?: React.HTMLAttributes<HTMLDivElement>["className"];
  itemClassName?: React.HTMLAttributes<HTMLDivElement>["className"];
  labelClassName?: React.HTMLAttributes<HTMLLabelElement>["className"];
  disabled?: boolean;
}

export interface SelectControlProperties extends CommonControlProperties {
  type: "select";
  options: SelectOption[];
}

export interface RadioControlProperties extends CommonControlProperties {
  type: "radio";
  options: RadioOption[];
}

export interface MultiSelectControlProperties extends CommonControlProperties {
  type: "multi-select";
  options: MultiSelectOption[];
}

export interface OTPInputProperties extends CommonControlProperties {
  type: "otp";
  name: string;
  label: string;
  maxLength: number;
  pattern: string;
  value: string;
}

interface NonSelectControlProperties extends CommonControlProperties {
  type?: Exclude<ControlType, "select" | "radio" | "multi-select">;
  options?: never;
}

export type ConditionalControlProperties =
  | SelectControlProperties
  | RadioControlProperties
  | MultiSelectControlProperties
  | NonSelectControlProperties
  | OTPInputProperties;
