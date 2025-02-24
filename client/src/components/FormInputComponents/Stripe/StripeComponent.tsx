import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FieldProps } from "../types";
import styles from "./StripeComponent.module.css";
import { useStripePromise } from "../../../api/stripe/service";
import { Elements } from "@stripe/react-stripe-js";
import {
  PaymentIntent,
  Stripe,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import CheckoutForm from "../../StripeForm/CheckoutForm";
import nullthrows from "nullthrows";
import { useCreatePaymentIntent } from "../../../api/stripe/mutations";
import { useTranslation } from "react-i18next";
import { updateFormPaymentType } from "../../../api/forms/service";

interface CheckoutFormRef {
  handlePayment: () => void;
}

const StripeComponent = forwardRef(({ field, sqlFormId }: FieldProps, ref) => {
  const { t } = useTranslation("FormComponents");
  const [options, setOptions] = useState<StripeElementsOptions | undefined>(
    undefined
  );
  const [paymentIntentCreated, setPaymentIntentCreated] = useState(false);
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentType, setPaymentType] = useState("stripe");
  const [currentPaymentIntent, setCurrentPaymentIntent] =
    useState<PaymentIntent | null>(null);

  const checkoutFormRef = useRef<CheckoutFormRef>(null);

  const { data: stripePromiseData } = useStripePromise(
    nullthrows(
      field.properties?.stripe_account?.stripe_account_id,
      "Stripe Account ID is missing"
    )
  );

  const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent(
    field,
    nullthrows(sqlFormId, "SQL Form ID is missing")
  );

  useEffect(() => {
    const handleCreatePaymentIntent = async () => {
      try {
        const paymentIntent: PaymentIntent = await createPaymentIntent();
        setCurrentPaymentIntent(paymentIntent);
        const fetchedClientSecret = paymentIntent.client_secret;
        if (fetchedClientSecret) {
          setClientSecret(fetchedClientSecret);
          setOptions({
            clientSecret: fetchedClientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#0570de",
                colorBackground: "#ffffff",
                colorText: "#30313d",
                colorDanger: "#df1b41",
              },
            },
          });
        } else {
          throw new Error("Client secret is missing in PaymentIntent");
        }
      } catch (error) {
        console.error("Error creating PaymentIntent:", error);
      }
    };

    const handleUpdateFormPaymentStatus = async () => {
      if (paymentType === "cash") {
        if (currentPaymentIntent) {
          await updateFormPaymentType(currentPaymentIntent.id, 2);
        }
      } else {
        if (currentPaymentIntent) {
          await updateFormPaymentType(currentPaymentIntent.id, 1);
        }
      }
    };

    if (stripePromiseData) {
      setStripePromise(stripePromiseData);
    }

    if (stripePromise && !paymentIntentCreated) {
      handleCreatePaymentIntent();
      setPaymentIntentCreated(true);
    }
    if (paymentIntentCreated && currentPaymentIntent !== null) {
      handleUpdateFormPaymentStatus();
    }
  }, [stripePromiseData, stripePromise, createPaymentIntent, paymentType]);

  useImperativeHandle(ref, () => ({
    handlePayment: checkoutFormRef.current?.handlePayment,
    handleCashPayment: () => ({
      amount: field.properties?.price?.value,
      payment_type: "cash",
    }),
  }));

  return (
    <section className={styles.container}>
      <div className={styles.questionContainer}>
        <h3 className={styles.question}>{field.title}</h3>
        {field.validations?.required && (
          <span className={styles.required}>*</span>
        )}
      </div>
      <div>
        <p>{"Payment Method"}</p>
        <div className={styles.questionContainer}>
          <label>
            <input
              type="radio"
              name="paymentType"
              value="stripe"
              checked={paymentType === "stripe"}
              className={styles.radio}
              onChange={() => setPaymentType("stripe")}
            />
            {"Stripe"}
          </label>
          <label>
            <input
              type="radio"
              name="paymentType"
              value="cash"
              className={styles.radio}
              checked={paymentType === "cash"}
              onChange={() => setPaymentType("cash")}
            />
            {"Cash"}
          </label>
        </div>
      </div>
      {paymentType === "stripe" ? (
        <div>
          <p>{field.properties?.description}</p>
          <p>
            <b>{t("stripe.price")}:</b> ${field.properties?.price?.value}{" "}
            {field.properties?.price?.currency}
          </p>
          {field.properties?.price?.isCustomerPayingFee && (
            <p>
              <b>{t("stripe.fee")}:</b> ${field.properties?.price?.feeValue}{" "}
              {field.properties?.price?.currency}
            </p>
          )}
          {stripePromise && clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm ref={checkoutFormRef} />
            </Elements>
          )}
        </div>
      ) : (
        <div>
          <p>{`Please pay registration fee of $${field.properties?.price?.value} to your league manager`}</p>
        </div>
      )}
    </section>
  );
});

StripeComponent.displayName = "StripeComponent";

export default StripeComponent;
