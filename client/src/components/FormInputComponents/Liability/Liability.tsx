import { FieldProps } from "../types";
import { FieldError, useFormContext } from "react-hook-form";
import styles from "./Liability.module.css";
import { useTranslation } from "react-i18next";

const Liability = ({ field, index }: FieldProps) => {
  const { t } = useTranslation("FormComponents");
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = (
    errors.answers as { [key: number]: { liability?: FieldError } } | undefined
  )?.[index]?.liability;

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
      <p>{field.properties?.description}</p>
      <div style={{ display: "flex", gap: "10px" }}>
        <label htmlFor={`liability-${index}`}>{"I have read and agree"}</label>
        <input
          type="checkbox"
          className={styles.input}
          id={`liability-${index}`}
          defaultChecked={true}
          {...register(`answers.${index}.liability`)}
        />
      </div>
    </section>
  );
};

export default Liability;
