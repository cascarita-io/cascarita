import { loadStripe, PaymentIntent } from "@stripe/stripe-js";
import {
  StripeAccount,
  StripeAccountSchema,
} from "../../components/DragAndDropComponents/DraggablePayment/types";
import { useQuery } from "@tanstack/react-query";
import nullthrows from "nullthrows";

export const connectStripe = async (formData: object) => {
  try {
    const response = await fetch("/api/accounts/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Error connecting to Stripe: ${response.status}`);
    }

    const data = await response.json();
    const stripeUrl = data.url;
    window.open(stripeUrl, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Error connecting to Stripe:", error);
  }
};

export const createPaymentIntent = async (
  stripeAccountId: string,
  form_id: string,
  userStripeAccountSqlId: string,
  transactionAmount: number,
  transactionFee: number
): Promise<PaymentIntent | null> => {
  try {
    const response = await fetch(
      `/api/accounts/${stripeAccountId}/paymentIntent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionAmount,
          transactionFee,
          form_id,
          userStripeAccountSqlId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error creating payment intent: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return null;
  }
};

export const getPublishableKey = async (): Promise<string> => {
  try {
    const response = await fetch("/api/accounts/key/publishable");

    if (!response.ok) {
      throw new Error(
        `fetching publishable key non-ok-response: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.key;
  } catch (error) {
    console.error("Error fetching publishable key:", error);
    return "";
  }
};

export const getStripeAccounts = async (
  groupId: number
): Promise<StripeAccount[]> => {
  try {
    const response = await fetch(`/api/accounts/${groupId}`);

    if (!response.ok) {
      throw new Error(`Error fetching Stripe accounts: ${response.status}`);
    }

    const data = await response.json();
    return StripeAccountSchema.array().parse(data);
  } catch (error) {
    console.error("Error fetching Stripe accounts:", error);
    return [];
  }
};

export const useStripePromise = (stripeAccount: string) => {
  return useQuery({
    queryKey: ["stripePromise"],
    queryFn: async () => {
      const publishableKey = await getPublishableKey();
      return loadStripe(
        nullthrows(publishableKey, "Publishable key is missing"),
        {
          stripeAccount,
        }
      );
    },
  });
};
