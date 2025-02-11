import { FieldProps } from "../types";
import { FieldError, useFormContext } from "react-hook-form";
import styles from "./PlayerBlock.module.css";
import { useTranslation } from "react-i18next";

const PlayerBlock = ({ field, index }: FieldProps) => {
  const { t } = useTranslation("FormComponents");
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { required } = field.validations ?? {};

  const fieldError = (
    errors.answers as
      | { [key: number]: { player_block?: FieldError } }
      | undefined
  )?.[index]?.player_block;

  return (
    <section className={styles.container}>
      <div>
        <div>
          <h4 className={styles.question}>League</h4>
          <p>{field.league}</p>

          <h4 className={styles.question}>Season</h4>
          <p>{field.season}</p>
        </div>
        <div style={{ display: "flex" }}>
          <h4 className={styles.question}>Division</h4>
          {field.validations?.required && (
            <span className={styles.required}>*</span>
          )}
        </div>
        <p>Please select a division</p>

        <select
          className={styles.input}
          {...register(`answers.${index}.player.division`, {
            required: required && t("required"),
          })}
        >
          <option value="">{t("dropdown.placeholder")}</option>
          {field.properties?.player_block_choices?.map((choice) => (
            <option key={choice.division} value={choice.division}>
              {choice.division}
            </option>
          ))}
        </select>
        <div style={{ display: "flex" }}>
          <h4 className={styles.question}>Team</h4>
          {field.validations?.required && (
            <span className={styles.required}>*</span>
          )}
        </div>
        <p>Please select a team</p>

        <select
          className={styles.input}
          {...register(`answers.${index}.text`, {
            required: required && t("required"),
          })}
        >
          <option value="">{t("dropdown.placeholder")}</option>
          {field.properties?.player_block_choices?.map((choice) =>
            choice.teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))
          )}
        </select>
      </div>
      {fieldError && (
        <span className={styles.errorMessage}>{fieldError.message}</span>
      )}
    </section>
  );
};

export default PlayerBlock;
