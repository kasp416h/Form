import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const Select = dynamic(() => import("./select"), {
  ssr: false,
});

const MultiSelect = dynamic(() => import("./multi-select"), {
  ssr: false,
});

const InputOTP = dynamic(() => import("./input-otp"), {
  ssr: false,
  loading: () => <Skeleton className="h-14" />,
});

export { Select, MultiSelect, InputOTP };
