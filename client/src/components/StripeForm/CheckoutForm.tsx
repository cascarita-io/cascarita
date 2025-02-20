import { PaymentElement } from "@stripe/react-stripe-js";
import { useState, forwardRef, useImperativeHandle } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import styles from "./CheckoutForm.module.css";
export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  amount?: number;
  error?: string;
}

const CheckoutForm = forwardRef((_props, ref) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);

  const handlePayment = async (): Promise<PaymentResult> => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return { success: false, error: "Stripe component not loading" };
    }

    const stripeConfirmedPayment = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeConfirmedPayment.error) {
      if (
        stripeConfirmedPayment.error.type === "card_error" ||
        stripeConfirmedPayment.error.type === "validation_error"
      ) {
        setMessage(stripeConfirmedPayment.error.message ?? "An error occurred");
      } else {
        setMessage("An unexpected error occurred.");
      }
      return { success: false, error: "Stripe error" };
    }

    return {
      success: true,
      paymentIntentId: stripeConfirmedPayment.paymentIntent?.id,
      amount: stripeConfirmedPayment.paymentIntent?.amount,
    };
  };

  useImperativeHandle(ref, () => ({
    handlePayment,
  }));

  return (
    <>
      <PaymentElement />
      {message && <div id={styles.paymentMessage}>{message}</div>}
    </>
  );
});

CheckoutForm.displayName = "CheckoutForm";

export default CheckoutForm;
