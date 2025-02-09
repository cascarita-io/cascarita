import { useRef } from "react";
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

  const methods = useForm<{ answers: Answer[] }>({
    defaultValues: { answers: [] },
  });

  // TODO: These will be components that have styles
  if (isLoading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>An error occurred: {error.message}</div>; // Show error state

  const onSubmit = async (data: { answers: Answer[] }) => {
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
          // The error message is already set within handlePayment
          // You can add any additional handling here if needed
          return;
        }
      }
      const responsesData = await createMongoResponse(
        formId ?? "",
        normalizedAnswers
      );
      // TODO: Redirect to a success page / thank you page?
      navigate("/forms/thanks");
      return responsesData;
    } catch (error) {
      console.error("Error creating responses:", error);
      throw error;
    }
  };

  return (
    <>
      <FormHeader />
      <div className={styles.container}>
        {form != null && (
          <FormProvider {...methods}>
            <form
              className={styles.formContent}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <h1 className={styles.title}>{form?.form_data.title}</h1>
              {form.form_data.fields.map((field: Field, index: number) => {
                const FieldComponent = FieldComponents[field.type];
                if (!FieldComponent) return null;
                if (FieldComponent === FieldComponents.payment) {
                  return (
                    <FieldComponent
                      key={field.id}
                      ref={stripeComponentRef}
                      field={field}
                      sqlFormId={form.sql_form_id}
                      index={index}
                    />
                  );
                }
                return (
                  <FieldComponent key={field.id} field={field} index={index} />
                );
              })}
              <button type="submit" className={styles.submitButton}>
                Submit
              </button>
            </form>
          </FormProvider>
        )}
      </div>
      <FormFooter />
    </>
  );
};

export default FormPage;
