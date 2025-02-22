import { useState, useEffect } from "react";
import { FieldProps } from "../types";
import { FieldError, useFormContext } from "react-hook-form";
import styles from "./Photo.module.css";
import { useTranslation } from "react-i18next";
import FileUpload from "../../FileUpload/FileUpload";

const Photo = ({ field, index }: FieldProps) => {
  const { t } = useTranslation("FormComponents");
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  register(`answers.${index}.photo`);

  useEffect(() => {
    if (fileUrl) {
      setValue(`answers.${index}.photo`, fileUrl);
    } else {
      setValue(`answers.${index}.photo`, "");
    }
  }, [fileUrl]);

  const fieldError = (
    errors.answers as { [key: number]: { photo?: FieldError } } | undefined
  )?.[index]?.photo;

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
      <div className={styles.questionContainer}>
        <p>{field.properties?.description}</p>
      </div>
      {fieldError && (
        <span className={styles.errorMessage}>{fieldError.message}</span>
      )}

      <FileUpload
        setFileValue={(url: string | null) => {
          setFileUrl(url);
        }}
        className={styles.logoInputContainer}
      />
    </section>
  );
};

export default Photo;
