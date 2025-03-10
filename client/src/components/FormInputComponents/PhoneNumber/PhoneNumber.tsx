import { FieldProps } from "../types";
import { FieldError, useFormContext } from "react-hook-form";
import styles from "./PhoneNumber.module.css";
import { useTranslation } from "react-i18next";

const PhoneNumber = ({ field, index }: FieldProps) => {
  const { t } = useTranslation("FormComponents");
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { required } = field.validations ?? {};

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
        {...register(`answers.${index}.phone_number`)}
      />
    </section>
  );
};

export default PhoneNumber;
