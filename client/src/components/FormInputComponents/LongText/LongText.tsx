import React from "react";
import { FieldProps } from "../types";
import { FieldError, useFormContext } from "react-hook-form";
import styles from "./LongText.module.css";
import { useTranslation } from "react-i18next";

const LongText = ({ field, index }: FieldProps) => {
  const { t } = useTranslation("FormComponents");
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // const [textAreaValue, setTextAreaValue] = useState("");
  const { required, max_length: maxLength } = field.validations ?? {};

  const fieldError = (
    errors.answers as { [key: number]: { text?: FieldError } } | undefined
  )?.[index]?.text;

  const { onChange: registerOnChange, ...registerProps } = register(
    `answers.${index}.text`,
    {
      required: required && t("required"),
      maxLength: maxLength && {
        value: maxLength,
        message: `${t("longText.maxLength")} ${maxLength}`,
      },
    }
  );

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    initialHeight: string = "auto",
    maxHeight: number = 500
  ) => {
    const textArea = event.target;
    textArea.style.height = initialHeight;
    textArea.style.height = `${Math.min(textArea.scrollHeight, maxHeight)}px`;
    registerOnChange(event);
  };

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
      <textarea
        className={styles.input}
        placeholder={t("longText.placeholder")}
        rows={1}
        onChange={(e) => handleTextAreaChange(e, "42px")}
        // value={textAreaValue}
        {...registerProps}
      />
      <p className={styles.longTextToolTip}>
        <strong>Shift ⇧</strong>
        <strong>Enter ↵</strong>
        {t("longText.break")}
      </p>
    </section>
  );
};

export default LongText;
