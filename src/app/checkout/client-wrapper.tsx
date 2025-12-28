"use client";

import { useEffect } from "react";
import { useData } from "@/context/data-context";
import CheckoutClient from "./client";
import type { School, ReadingPlanItem } from "@/lib/types";

interface CheckoutPageContentProps {
  initialSchools: School[];
  initialReadingPlan: ReadingPlanItem[];
}

export default function CheckoutPageContent({ initialSchools, initialReadingPlan }: CheckoutPageContentProps) {
  const { setSchools, setReadingPlan } = useData();

  useEffect(() => {
    setSchools(initialSchools);
    setReadingPlan(initialReadingPlan);
  }, [initialSchools, initialReadingPlan, setSchools, setReadingPlan]);

  return <CheckoutClient />;
}
