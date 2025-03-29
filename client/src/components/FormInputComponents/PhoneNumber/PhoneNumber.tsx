import { FieldError, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FieldProps } from "../types";
import styles from "./PhoneNumber.module.css";

const PhoneNumber = ({ field, index }: FieldProps) => {
  const { t } = useTranslation("FormComponents");
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = (
    errors.answers as
      | { [key: number]: { phone_number?: FieldError } }
      | undefined
  )?.[index]?.phone_number;

  // TODO: Implement a way to get proper country code, we have field?.properties?.default_country_code to see what country code to use
  // This would require more regex to validate the phone number

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
        type="tel"
        placeholder="(201) 555-0123"
        {...register(`answers.${index}.phone_number`, {
          minLength: {
            value: 9,
            message: "Must be at least 9 digits",
          },
          maxLength: {
            value: 19,
            message: "Must be less than 20 digits",
          },
          pattern: {
            value: /^\d+$/,
            message: "Number must be numeric",
          },
        })}
      />
    </section>
  );
};

export default PhoneNumber;
