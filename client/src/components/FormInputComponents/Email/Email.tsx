import { FieldError, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FieldProps } from "../types";
import styles from "./Email.module.css";

const Email = ({ field, index }: FieldProps) => {
  const { t } = useTranslation("FormComponents");
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = (
    errors.answers as { [key: number]: { email?: FieldError } } | undefined
  )?.[index]?.email;

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
        className={styles.input}
        type="email"
        placeholder="name@example.com"
        {...register(`answers.${index}.email`, {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        })}
      />
    </section>
  );
};

export default Email;
