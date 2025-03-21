import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { AnswerMap, FieldComponents } from "./types";
import { createMongoResponse } from "../../api/forms/service";
import FormHeader from "../../components/FormHeader/FormHeader";
import styles from "./FormPage.module.css";
import {
  Answer,
  AnswerType,
  Field,
  SecondaryType,
} from "../../api/forms/types";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { PaymentResult } from "../../components/StripeForm/CheckoutForm";
import { FormSchemaType } from "./schema";
import { useGetFormByDocumentId } from "../../api/forms/query";

const FormPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const stripeComponentRef = useRef<{
    handlePayment: () => Promise<PaymentResult>;
    handleCashPayment: () => Promise<{
      amount: number;
      payment_type: string;
      paymentIntentId: string;
    }>;
  } | null>(null);

  const {
    data: form,
    isLoading,
    error,
  } = useGetFormByDocumentId(formId === undefined ? "" : formId);

  const total = form?.form_data.fields.length ?? 0;
  const [used, setUsed] = useState(1);

  const methods = useForm<FormSchemaType>({
    defaultValues: { answers: {} },
    mode: "onChange",
  });

  const [currentField, setCurrentField] = useState<Field | undefined>(
    undefined
  );
  const [currentAnswer, setCurrentAnswer] = useState<Answer | undefined>(
    undefined
  );

  useEffect(() => {
    if (form) {
      setCurrentField(form.form_data.fields[used - 1]);
      setCurrentAnswer(methods.watch(`answers.${used - 1}`));
    }
  }, [form, used]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (used === total) {
          // Trigger submit button click
          document.getElementById("submitButton")?.click();
        } else {
          // Trigger next button click
          document.getElementById("nextButton")?.click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [used, total]);

  if (isLoading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>An error occurred: {error.message}</div>; // Show error state

  const onSubmit = async (data: { answers: Record<string, Answer> }) => {
    const normalizedAnswers: Answer[] =
      form?.form_data.fields.map((field: Field, index: number) => {
        const answerType =
          field.type === "multiple_choice" &&
          field.properties?.allow_multiple_selection
            ? "choices"
            : (AnswerMap[field.type] as AnswerType);

        if (field.secondary_type) {
          return {
            ...data.answers[index],
            field: { id: field.id, type: field.type, ref: field.ref },
            type: answerType,
            secondary_type: field.secondary_type as SecondaryType,
          };
        } else {
          return {
            ...data.answers[index],
            field: { id: field.id, type: field.type, ref: field.ref },
            type: answerType,
          };
        }
      }) ?? [];

    try {
      if (
        stripeComponentRef.current &&
        stripeComponentRef.current.handlePayment
      ) {
        const { success, paymentIntentId, amount, payment_type } =
          await stripeComponentRef.current.handlePayment();
        if (!success) {
          return;
        } else {
          const updatedNormalizedAnswers = normalizedAnswers.map((answer) => {
            if (answer.type === "payment") {
              return {
                ...answer,
                paymentIntentId: paymentIntentId,
                payment_type: payment_type,
                amount: amount,
              };
            }
            return answer;
          });
          const responsesData = await createMongoResponse(
            formId ?? "",
            updatedNormalizedAnswers
          );
          // TODO: Redirect to a thank you page!
          navigate("/thanks");
          return responsesData;
        }
      } else if (
        stripeComponentRef.current &&
        stripeComponentRef.current.handleCashPayment
      ) {
        const { amount, payment_type, paymentIntentId } =
          await stripeComponentRef.current.handleCashPayment();

        const updatedNormalizedAnswers = normalizedAnswers.map((answer) => {
          if (answer.type === "payment") {
            return {
              ...answer,
              paymentIntentId: paymentIntentId,
              payment_type: payment_type,
              amount: amount,
            };
          }
          return answer;
        });
        const responsesData = await createMongoResponse(
          formId ?? "",
          updatedNormalizedAnswers
        );
        // TODO: Redirect to a thank you page!
        navigate("/thanks");
        return responsesData;
      }

      // TODO: need to get payment intent id sent into this
      const responsesData = await createMongoResponse(
        formId ?? "",
        normalizedAnswers
      );
      navigate("/thanks");
      return responsesData;
    } catch (error) {
      console.error("Error creating responses:", error);
      throw error;
    }
  };

  const hasErrors = () => {
    return (
      methods.formState.errors.answers !== undefined &&
      methods.formState.errors.answers[`${used - 1}`] !== undefined
    );
  };

  const isNotEmpty = () => {
    return (
      currentField?.validations?.required &&
      (currentAnswer === undefined ||
        currentAnswer[`${currentField.type}` as AnswerType] === "")
    );
  };

  return (
    <>
      <FormHeader used={used} total={total} />
      <div className={styles.progressBarContainer}>
        <ProgressBar used={used} total={total} />
      </div>
      <div className={styles.container}>
        {form != null && (
          <FormProvider {...methods}>
            <form
              className={styles.formContent}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <h1 className={styles.title}>{form?.form_data.title}</h1>
              {form.form_data.fields
                .filter((_: Field, index: number) => index === used - 1)
                .map((field: Field) => {
                  const FieldComponent = FieldComponents[field.type];
                  if (!FieldComponent) return null;
                  if (FieldComponent === FieldComponents.payment) {
                    return (
                      <FieldComponent
                        key={field.id}
                        ref={stripeComponentRef}
                        field={field}
                        sqlFormId={form.sql_form_id}
                        index={used - 1}
                      />
                    );
                  }
                  return (
                    <FieldComponent
                      key={field.id}
                      field={field}
                      index={used - 1}
                    />
                  );
                })}
              <div className={styles.buttonContainer}>
                {used > 1 && (
                  <button
                    type="button"
                    className={styles.prevButton}
                    onClick={(e) => {
                      e.preventDefault();
                      setUsed((prev) => prev - 1);
                    }}
                  >
                    Back
                  </button>
                )}
                {used === total ? (
                  <button
                    type="submit"
                    id="submitButton"
                    className={styles.submitButton}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    type="button"
                    id="nextButton"
                    className={styles.nextButton}
                    onClick={(e) => {
                      e.preventDefault();
                      setUsed((prev) => prev + 1);
                    }}
                    disabled={hasErrors() || isNotEmpty()}
                  >
                    Next
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        )}
      </div>
    </>
  );
};

export default FormPage;
