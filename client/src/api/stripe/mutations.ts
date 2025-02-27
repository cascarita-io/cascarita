import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { createPaymentIntent } from "./service";
import { Field } from "../forms/types";
import { PaymentIntent } from "@stripe/stripe-js";

const normalizePriceToCents = (price: string | number | undefined): number => {
  if (price === undefined) {
    throw new Error("Price value is undefined");
  }

  const priceNumber = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(priceNumber)) {
    throw new Error("Invalid price value");
  }

  return Math.round(priceNumber * 100);
};

export const useCreatePaymentIntent = (
  field: Field,
  sqlFormId: string
): UseMutationResult<PaymentIntent, Error, void, unknown> => {
  return useMutation({
    mutationFn: async () => {
      const stripeAccountId =
        field.properties?.stripe_account?.stripe_account_id;
      if (!stripeAccountId) {
        throw new Error("No Stripe Account ID");
      }

      if (!sqlFormId) {
        throw new Error("Form has no SQL id");
      }

      const stripeAccountInternalId = field.properties?.stripe_account?.id;
      if (!stripeAccountInternalId) {
        throw new Error("No Stripe Account Internal ID");
      }

      const priceValue = normalizePriceToCents(field.properties?.price?.value);
      const feeValue = normalizePriceToCents(field.properties?.price?.feeValue);

      const paymentIntent = await createPaymentIntent(
        stripeAccountId,
        sqlFormId,
        stripeAccountInternalId,
        priceValue,
        feeValue
      );

      if (!paymentIntent) {
        throw new Error("Failed to create payment intent");
      }

      return paymentIntent;
    },
  });
};
