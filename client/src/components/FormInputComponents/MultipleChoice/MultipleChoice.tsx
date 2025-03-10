import { FieldProps } from "../types";
import { FieldError, useFormContext } from "react-hook-form";
import styles from "./MultipleChoice.module.css";
import { useTranslation } from "react-i18next";

const MultipleChoice = ({ field, index }: FieldProps) => {
  const { t } = useTranslation("FormComponents");
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { required } = field.validations ?? {};

  const fieldError = (
    errors.answers as
      | {
          [key: number]: {
            choices?: { labels?: FieldError };
            choice?: { label?: FieldError };
          };
        }
      | undefined
  )?.[index];

  const isMultipleSelection = field.properties?.allow_multiple_selection;

  return (
    <section className={styles.container}>
      <div className={styles.questionContainer}>
        <h3 className={styles.question}>
          {t("question")}: {field.title}
        </h3>
        {field.validations?.required && (
          <span className={styles.required}>*</span>
        )}
      </div>
      {fieldError && (
        <span className={styles.errorMessage}>
          {isMultipleSelection
            ? fieldError.choices?.labels?.message
            : fieldError.choice?.label?.message}
        </span>
      )}
      <div className={styles.choicesContainer}>
        {field.properties?.choices?.map((choice) => (
          <label key={choice.id} className={styles.choiceLabel}>
            <input
              type={isMultipleSelection ? "checkbox" : "radio"}
              value={choice.label}
              {...register(
                isMultipleSelection
                  ? `answers.${index}.choices.labels`
                  : `answers.${index}.choice.label`
              )}
            />
            {choice.label}
          </label>
        ))}
      </div>
    </section>
  );
};

export default MultipleChoice;
