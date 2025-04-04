import React, { memo } from "react";

import { FormControl } from "@/components/ui/form";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadSelect,
} from "@/components/ui/select";

type Option = {
  value: string;
  label: string;
  itemClassName?: React.HTMLAttributes<HTMLDivElement>["className"];
};

interface SelectProperties {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function Select({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: SelectProperties) {
  return (
    <ShadSelect
      onValueChange={onChange}
      defaultValue={value}
      disabled={disabled}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={option.itemClassName || ""}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </ShadSelect>
  );
}

const MemorizedSelect = memo(Select);

export default MemorizedSelect;
