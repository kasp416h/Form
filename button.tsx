"use client";

import React, { useContext, useState } from "react";

import { Button as ButtonUi } from "@/components/ui/button";

import { FormContext } from "./form";

interface ButtonProperties {
  text: string;
  className?: string;
}

export const Button: React.FC<ButtonProperties> = ({
  text = "Submit",
  className,
}) => {
  const { isSubmitting } = useContext(FormContext) || {};

  const [effect, setEffect] = useState(false);

  const handleClick = () => {
    setEffect(true);
  };

  if (isSubmitting === undefined) {
    console.error("DynamicButton must be used within a FormContext.Provider");
    return;
  }

  return (
    <ButtonUi
      type="submit"
      onClick={handleClick}
      disabled={isSubmitting}
      style={{
        opacity: isSubmitting ? "0.5" : "1",
      }}
      className={`${effect ? "animate-btnClick" : ""} ${className}`}
      onAnimationEnd={() => setEffect(false)}
    >
      {isSubmitting ? "Indlæser..." : text}
    </ButtonUi>
  );
};
