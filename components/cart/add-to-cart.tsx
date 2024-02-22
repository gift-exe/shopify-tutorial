'use client';

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { addItem } from "./action";
import LoadingDots from "../loading-dots";
import { ProductVariant } from "../../lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton({
    availableForSale,
    selectedVariantId
}: {
    availableForSale: boolean;
    selectedVariantId: string | undefined;
}) {
    const { pending } = useFormStatus();
}