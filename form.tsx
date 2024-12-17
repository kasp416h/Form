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
  steps?: React.JSX.Element[];
  stepActions?: ((data: any) => Promise<ActionResponse>)[];
  encryptedFields?: string[];
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
  steps,
  stepActions = [],
  encryptedFields = [],
}) => {
  const router = useRouter();

  const [csrfToken, setCsrfToken] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(multiStep);

  const methods = useForm({
    mode: "onSubmit",
    defaultValues: item,
  });

  const totalSteps = steps?.length || 1;

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token || "");
    };
    fetchCsrfToken();
  }, []);

  // Retrieve and set the saved step from sessionStorage on mount
  useEffect(() => {
    const savedStep = sessionStorage.getItem("currentStep");
    if (savedStep !== null && Number(savedStep) < totalSteps) {
      setCurrentStep(Number(savedStep));
    }
    setLoading(false);
  }, [totalSteps]);

  // Store current step in sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem("currentStep", String(currentStep));
  }, [currentStep]);

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

        return toast.error(response.error);
      }

      if (response.success) {
        toast.success(response.success);
      }

      const redirectUrl = response.redirect || redirect;

      if (multiStep) {
        if (currentStep < totalSteps - 1) {
          setCurrentStep((previous) => previous + 1);
        } else {
          sessionStorage.removeItem("currentStep");
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

  if (loading) {
    return;
  }

  return (
    <FormContext.Provider
      value={{
        isSubmitting: methods.formState.isSubmitting,
        currentStep,
        setCurrentStep,
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
