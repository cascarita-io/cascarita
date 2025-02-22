import { FieldProps } from "../types";
import { FieldError, useFormContext } from "react-hook-form";
import styles from "./PlayerBlock.module.css";
import { useTranslation } from "react-i18next";
import { ShortTeam } from "../../../api/forms/types";

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
          <p>{field.league_name}</p>
          <input
            type="hidden"
            {...register(`answers.${index}.player.league_name`, {
              value: field.league_name,
            })}
          />
          <input
            type="hidden"
            {...register(`answers.${index}.player.league_id`, {
              value: field.league_id,
            })}
          />

          <h4 className={styles.question}>Season</h4>
          <p>{field.season_name}</p>
          <input
            type="hidden"
            {...register(`answers.${index}.player.season_name`, {
              value: field.season_name,
            })}
          />
          <input
            type="hidden"
            {...register(`answers.${index}.player.season_id`, {
              value: field.season_id,
            })}
          />
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
          {...register(`answers.${index}.player.division_id`, {
            required: required && t("required"),
            onChange: (e) => {
              const selectedDivision =
                field.properties?.player_block_choices?.find(
                  (choice) => choice.division_id === e.target.value
                );
              if (selectedDivision) {
                register(`answers.${index}.player.division_name`).onChange({
                  target: { value: selectedDivision.division_name },
                });
              }
            },
          })}
        >
          <option value="">{t("dropdown.placeholder")}</option>
          {field.properties?.player_block_choices?.map((choice) => (
            <option key={choice.division_id} value={choice.division_id}>
              {choice.division_name}
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
          {...register(`answers.${index}.player.team_id`, {
            required: required && t("required"),
            onChange: (e) => {
              const selectedTeam = field.properties?.player_block_choices
                ?.flatMap((choice) => choice.teams)
                .find((team: ShortTeam) => team.team_id === e.target.value);
              if (selectedTeam) {
                register(`answers.${index}.player.team_name`).onChange({
                  target: { value: selectedTeam.team_name },
                });
              }
            },
          })}
        >
          <option value="">{t("dropdown.placeholder")}</option>
          {field.properties?.player_block_choices?.map((choice) =>
            choice.teams.map((team: ShortTeam) => (
              <option key={team.team_id} value={team.team_id}>
                {team.team_name}
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
