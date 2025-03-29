import { FieldError, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FieldProps } from "../types";
import styles from "./ShortText.module.css";

const ShortText = ({ field, index }: FieldProps) => {
  const { t } = useTranslation("FormComponents");
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = (
    errors.answers as { [key: number]: { short_text?: FieldError } } | undefined
  )?.[index]?.short_text;

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
        type="text"
        placeholder={t("shortText.placeholder")}
        {...register(`answers.${index}.short_text`, {
          maxLength: {
            value: 30,
            message: "Can not exceed more than 30 characters",
          },
        })}
      />
    </section>
  );
};

export default ShortText;
