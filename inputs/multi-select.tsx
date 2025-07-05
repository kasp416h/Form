"use client";

import React, { useState, useRef, useCallback, memo } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";

type Option = Record<"value" | "label", string>;

interface MultiSelectProperties {
  value: Option[];
  options: Option[];
  onChange: (value: Option[]) => void;
  placeholder: string;
  [key: string]: unknown;
}

function MultiSelect({
  value,
  options,
  onChange,
  placeholder,
}: MultiSelectProperties) {
  const inputReference = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback(
    (option: Option) => {
      const updatedSelection = value.filter((s) => s.value !== option.value);
      onChange(updatedSelection);
    },
    [value, onChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputReference.current;
      if (input) {
        if (
          (event.key === "Delete" || event.key === "Backspace") &&
          input.value === ""
        ) {
          const newSelected = [...value];
          newSelected.pop();
          onChange(newSelected);
        }

        if (event.key === "Escape") {
          input.blur();
        }
      }
    },
    [value, onChange]
  );

  const selectables = options.filter(
    (option) => !value.some((s) => s.value === option.value)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {value.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="text-sm font-normal"
            >
              {option.label}
              <button
                className="ml-1 rounded-full outline-hidden ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleUnselect(option);
                  }
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={() => handleUnselect(option)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputReference}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-hidden animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      onChange([...value, option]);
                    }}
                    className={"cursor-pointer"}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ) : undefined}
        </CommandList>
      </div>
    </Command>
  );
}

const MemorizedMultiSelect = memo(MultiSelect);

export default MemorizedMultiSelect;
