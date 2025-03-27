import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import styles from "../Form.module.css";
import { PlayerFormPageProps } from "./types";

const PlayerFormPageOne: React.FC<PlayerFormPageProps> = ({ requestError }) => {
  const { t } = useTranslation("Players");
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <div className={styles.inlineInputContainer}>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="playerName">
            {t("formContent.first_name")}
          </label>
          <input
            {...register("first_name")}
            className={`${styles.input} ${errors.first_name ? styles.invalid : ""}`}
            placeholder={t("formContent.first_name")}
            id="leagueName"
          />
          {errors.first_name && (
            <span className={styles.error}>
              {String(errors.first_name.message)}
            </span>
          )}
        </div>

        <div className={`${styles.inputContainer}`}>
          <label className={styles.label} htmlFor="lastName">
            {t("formContent.last_name")}
          </label>
          <input
            {...register("last_name")}
            className={`${styles.input} ${errors.last_name ? styles.invalid : ""}`}
            placeholder={t("formContent.last_name")}
            id="lastName"
          />
          {errors.last_name && (
            <span className={styles.error}>
              {String(errors.last_name.message)}
            </span>
          )}
        </div>
      </div>

      <div className={`${styles.inputContainer}`}>
        <label className={styles.label} htmlFor="email">
          {t("formContent.email")}
        </label>
        <input
          {...register("email")}
          className={`${styles.input} ${errors.email ? styles.invalid : ""}`}
          placeholder={t("formContent.email")}
          id="email"
        />
        {errors.email && (
          <span className={styles.error}>{String(errors.email.message)}</span>
        )}
        {requestError && <span className={styles.error}>{requestError}</span>}
      </div>

      <div className={`${styles.inlineInputContainer}`}>
        <div className={`${styles.inputContainer}`}>
          <label className={styles.label} htmlFor="phoneNumber">
            {t("formContent.phone_number")}
          </label>
          <input
            {...register("phone_number")}
            className={`${styles.input} ${errors.phone_number ? styles.invalid : ""}`}
            placeholder={"(201) 456 7891"}
            id="phoneNumber"
          />
          {errors.phone_number && (
            <span className={styles.error}>
              {String(errors.phone_number.message)}
            </span>
          )}
        </div>

        <div className={`${styles.inputContainer}`}>
          <label className={styles.label} htmlFor="date_of_birth">
            {t("formContent.date_of_birth")}
          </label>
          <input
            {...register("date_of_birth")}
            className={`${styles.input} ${errors.date_of_birth ? styles.invalid : ""}`}
            type="date"
            id="date_of_birth"
          />
          {errors.date_of_birth && (
            <span className={styles.error}>
              {String(errors.date_of_birth.message)}
            </span>
          )}
        </div>
      </div>

      <div className={`${styles.inputContainer}`}>
        <label className={styles.label} htmlFor="address">
          {t("formContent.address")}
        </label>
        <input
          {...register("address")}
          className={`${styles.input} ${errors.address ? styles.invalid : ""}`}
          placeholder="123 Main St, Salinas, CA"
          id="address"
        />
        {errors.address && (
          <span className={styles.error}>{String(errors.address.message)}</span>
        )}
      </div>
    </>
  );
};

export default PlayerFormPageOne;
