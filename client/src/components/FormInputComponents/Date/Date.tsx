import { FieldError, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FieldProps } from "../types";
import styles from "./Date.module.css";

const Date = ({ field, index }: FieldProps) => {
  const { t } = useTranslation("FormComponents");
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = (
    errors.answers as { [key: number]: { date?: FieldError } } | undefined
  )?.[index]?.date;

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
        <span className={styles.errorMessage}>{fieldError.message}</span>
      )}

      <input
        type="date"
        className={styles.input}
        {...register(`answers.${index}.date`, {
          required: "Please enter date of birth",
        })}
      />
    </section>
  );
};

export default Date;
