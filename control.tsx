"use client";

import React, { useCallback, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

import { ErrorMessage } from "@hookform/error-message";
import { useFormContext } from "react-hook-form";

import { formHelpers } from "./helpers";
import { Select, MultiSelect, InputOTP } from "./inputs";
import { FormHelpers } from "./types";
import {
  CheckboxProperties,
  ConditionalControlProperties,
  MultiSelectControlProperties,
  OTPInputProperties,
  RadioControlProperties,
  SelectControlProperties,
} from "./types/control";

export const Control: React.FC<ConditionalControlProperties> = (properties) => {
  const {
    group,
    name,
    type = "text",
    label,
    description = "",
    required = false,
    placeholder = "",
    onFormBlur,
    defaultValue,
    wrapperClassName,
    itemClassName,
    labelClassName,
    ...rest
  } = properties;

  const { control, formState, setValue } = useFormContext();
  const { errors } = formState;

  const fieldName = group ? `${group}.${name}` : name;

  // Handle onBlur with form helpers
  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = event.target.value;
      if (
        typeof onFormBlur === "string" &&
        formHelpers[onFormBlur as FormHelpers]
      ) {
        value = formHelpers[onFormBlur as FormHelpers](value);
      } else if (typeof onFormBlur === "function") {
        value = onFormBlur(value);
      }
      setValue(fieldName, value, { shouldValidate: true });
    },
    [onFormBlur, setValue, fieldName]
  );

  // Adjust default value based on input type
  const adjustedDefaultValue = useMemo(() => {
    switch (type) {
      case "switch":
      case "checkbox": {
        return defaultValue ?? false;
      }
      case "select": {
        return (
          defaultValue ||
          (properties as SelectControlProperties | MultiSelectControlProperties)
            .options[0]?.value
        );
      }
      default: {
        return defaultValue || "";
      }
    }
  }, [type, defaultValue, properties]);

  // Select a component based on the type
  const renderInput = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (field: any) => {
      switch (type) {
        case "select": {
          return (
            <Select
              options={(properties as SelectControlProperties).options}
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
            />
          );
        }
        case "radio": {
          return (
            <RadioGroup onValueChange={field.onChange} value={field.value}>
              {(properties as RadioControlProperties).options.map((option) => (
                <FormItem key={option.value}>
                  <RadioGroupItem value={option.value} id={option.value} />
                  <FormLabel htmlFor={option.value}>{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          );
        }
        case "multi-select": {
          return (
            <MultiSelect
              {...field}
              options={(properties as MultiSelectControlProperties).options}
              value={field.value || []}
              onChange={field.onChange}
              placeholder={placeholder}
              {...rest}
            />
          );
        }
        case "otp": {
          return (
            <InputOTP
              {...field}
              maxLength={(properties as OTPInputProperties).maxLength}
              pattern={(properties as OTPInputProperties).pattern}
              value={field.value}
              onChange={field.onChange}
              {...rest}
            />
          );
        }
        case "textarea": {
          return (
            <Textarea
              {...field}
              placeholder={placeholder}
              onBlur={handleBlur}
              {...rest}
            />
          );
        }
        case "checkbox": {
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={(checked) => field.onChange(checked)}
                id={fieldName}
                {...(rest as CheckboxProperties)}
              />
              {label && (
                <FormLabel
                  htmlFor={fieldName}
                  className={"form-label " + labelClassName}
                >
                  {label}
                  {required && <span className="form-required ml-1">*</span>}
                </FormLabel>
              )}
            </div>
          );
        }
        case "switch": {
          return (
            <div className={cn("flex items-center space-x-2", itemClassName)}>
              <Switch
                checked={field.value ?? false}
                onCheckedChange={(checked) => field.onChange(checked)}
                id={fieldName}
                {...(rest as CheckboxProperties)}
              />
              {label && (
                <FormLabel
                  htmlFor={fieldName}
                  className={"form-label " + labelClassName}
                >
                  {label}
                  {required && <span className="form-required ml-1">*</span>}
                </FormLabel>
              )}
            </div>
          );
        }
        default: {
          return (
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={handleBlur}
              {...rest}
            />
          );
        }
      }
    },
    [
      type,
      placeholder,
      handleBlur,
      fieldName,
      properties,
      rest,
      label,
      required,
      labelClassName,
      itemClassName,
    ]
  );

  return (
    <FormField
      control={control}
      name={fieldName}
      defaultValue={adjustedDefaultValue}
      render={({ field }) => (
        <FormItem className={wrapperClassName}>
          {label && type !== "checkbox" && type !== "switch" && (
            <FormLabel
              htmlFor={fieldName}
              className={"form-label " + labelClassName}
            >
              {label}
              {required && <span className="form-required ml-1">*</span>}
            </FormLabel>
          )}
          {type === "select" ? (
            renderInput(field)
          ) : (
            <FormControl>{renderInput(field)}</FormControl>
          )}
          {description && (
            <FormDescription className="form-description">
              {description}
            </FormDescription>
          )}
          <ErrorMessage
            errors={errors}
            name={fieldName}
            render={({ message }) => (
              <FormMessage className="form-error">{message}</FormMessage>
            )}
          />
        </FormItem>
      )}
    />
  );
};
