/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode, createContext, useEffect, useState } from "react";

import { Form as ShadcnForm } from "@/components/ui/form";

import { useRouter } from "next/navigation";

import { getCsrfToken } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { processAndEncryptFields } from "./crypt/client";
import "./styles.css";

interface FormContextType {
  isSubmitting: boolean;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  triggerSubmit: () => Promise<void>;
}

export const FormContext = createContext<FormContextType | undefined>(
  undefined
);

interface FormProperties {
  children?: ReactNode;
  onSubmit?: (data: any) => Promise<ActionResponse>;
  item?: any;
  method?: string;
  action?: string;
  enctype?: string;
  idPrefix?: string;
  redirect?: string;
  style?: React.CSSProperties;
  className?: string;
  multiStep?: boolean;
  defaultStep?: number;
  steps?: React.JSX.Element[];
  stepActions?: ((data: any) => Promise<ActionResponse>)[];
  encryptedFields?: string[];
  autoCloseDialog?: string;
}

export const Form: React.FC<FormProperties> = ({
  children,
  onSubmit,
  item,
  method = "post",
  action = "",
  enctype = "application/x-www-form-urlencoded",
  idPrefix,
  redirect,
  style,
  className,
  multiStep = false,
  defaultStep = 0,
  steps,
  stepActions = [],
  encryptedFields = [],
  autoCloseDialog,
}) => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(defaultStep);

  const methods = useForm({
    mode: "onSubmit",
    defaultValues: item,
  });

  const totalSteps = steps?.length || 1;

  // Reset form when item updates
  useEffect(() => {
    if (item) {
      methods.reset(item);
    }
  }, [item]);

  const handleFormSubmit: SubmitHandler<any> = async (data) => {
    try {
      const submitAction = stepActions[currentStep] || onSubmit;
      if (!submitAction) return;

      let processedData = data;

      if (encryptedFields.length > 0) {
        processedData = await processAndEncryptFields(data, encryptedFields);
      }

      const csrfToken = await getCsrfToken();

      const response: ActionResponse = await submitAction({
        ...item,
        ...processedData,
        csrfToken,
      });

      if (response.error) {
        if (response.validationErrors) {
          for (const error of response.validationErrors) {
            methods.setError(error.path.join("."), {
              type: "server",
              message: error.message,
            });
          }
        }

        const errorMessage =
          typeof response.error === "string"
            ? response.error
            : "Ups noget gik galt!";

        console.log(response);

        return toast.error(errorMessage);
      }

      if (autoCloseDialog) {
        const closeButton = document.getElementById(
          autoCloseDialog
        ) as HTMLElement;

        if (closeButton) {
          closeButton.click();
        }
      }

      if (response.success) {
        toast.success(response.success);
      }

      const redirectUrl = response.redirect || redirect;

      if (multiStep) {
        if (currentStep < totalSteps - 1) {
          setCurrentStep((previous) => previous + 1);
        }
      }
      if (redirectUrl) {
        router.push(redirectUrl);
      }
      router.refresh();
      if (!item) methods.reset();
    } catch {
      toast.error("Ups noget gik galt!");
    }
  };

  const triggerSubmit = async () => {
    await methods.handleSubmit(handleFormSubmit)();
  };

  return (
    <FormContext.Provider
      value={{
        isSubmitting: methods.formState.isSubmitting,
        currentStep,
        setCurrentStep,
        triggerSubmit,
      }}
    >
      <ShadcnForm {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleFormSubmit)}
          method={item ? "patch" : method}
          action={action}
          encType={enctype}
          style={style}
          className={`form-wrapper ${className}`}
          id={idPrefix ? `form-${idPrefix}` : undefined}
        >
          {multiStep && steps && steps[currentStep]}
          {children}
        </form>
      </ShadcnForm>
    </FormContext.Provider>
  );
};
