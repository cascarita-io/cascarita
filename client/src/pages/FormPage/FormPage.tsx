import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMongoFormById } from "../../api/forms/service";
import { FormProvider, useForm } from "react-hook-form";
import { AnswerMap, FieldComponents, FetchedForm } from "./types";
import { createMongoResponse } from "../../api/forms/service";
import FormHeader from "../../components/FormHeader/FormHeader";
import FormFooter from "../../components/FormFooter/FormFooter";
import styles from "./FormPage.module.css";
import { Answer, AnswerType, Field } from "../../api/forms/types";
import ProgressBar from "../../components/ProgressBar/ProgressBar";

const FormPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const stripeComponentRef = useRef<{
    handlePayment: () => Promise<boolean>;
  } | null>(null);
  const {
    data: form,
    isLoading,
    error,
  } = useQuery<FetchedForm, Error>({
    queryKey: ["form", formId],
    queryFn: () =>
      formId
        ? getMongoFormById(formId)
        : Promise.reject(new Error("Form ID is undefined")),
  });

  const total = form?.form_data.fields.length ?? 0;
  const [used, setUsed] = useState(1);

  const methods = useForm<{
    answers: Record<string, Answer>;
  }>({
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

        return {
          ...data.answers[index],
          field: { id: field.id, type: field.type, ref: field.ref },
          type: answerType,
        };
      }) ?? [];

    try {
      if (stripeComponentRef.current) {
        const success = await stripeComponentRef.current.handlePayment();
        if (!success) {
          return;
        }
      }
      const responsesData = await createMongoResponse(
        formId ?? "",
        normalizedAnswers
      );
      navigate('ThankYou');
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
      <FormHeader />
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
                .filter((_, index: number) => index === used - 1)
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
                    className={styles.submitButton}
                    disabled={hasErrors() || isNotEmpty()}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    type="button"
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
      <FormFooter />
    </>
  );
};

export default FormPage;
