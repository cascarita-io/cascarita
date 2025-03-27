import { FieldError, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FieldProps } from "../types";
import styles from "./Dropdown.module.css";

const Dropdown = ({ field, index }: FieldProps) => {
  const { t } = useTranslation("FormComponents");
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = (
    errors.answers as { [key: number]: { drop_down?: FieldError } } | undefined
  )?.[index]?.drop_down;

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
      <select
        className={styles.input}
        {...register(`answers.${index}.dropdown`)}>
        <option value="">{t("dropdown.placeholder")}</option>
        {field.properties?.choices?.map((choice) => (
          <option key={choice.id} value={choice.label}>
            {choice.label}
          </option>
        ))}
      </select>
    </section>
  );
};

export default Dropdown;
