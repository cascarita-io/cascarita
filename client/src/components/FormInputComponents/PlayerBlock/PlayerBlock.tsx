import { useState } from "react";
import { FieldProps } from "../types";
import { FieldError, useFormContext } from "react-hook-form";
import styles from "./PlayerBlock.module.css";
import { useTranslation } from "react-i18next";
import { ShortTeam } from "../../../api/forms/types";

const PlayerBlock = ({ field, index }: FieldProps) => {
  const { t } = useTranslation("FormComponents");
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { required } = field.validations ?? {};
  const [isOther, setIsOther] = useState(false);

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

          <h4 className={styles.question}>Division</h4>
          <p>{field.division_name}</p>
          <input
            type="hidden"
            {...register(`answers.${index}.player.division_name`, {
              value: field.division_name,
            })}
          />
          <input
            type="hidden"
            {...register(`answers.${index}.player.division_id`, {
              value: field.division_id,
            })}
          />
        </div>
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
              const selectedTeam =
                field.properties?.player_block_choices?.teams.find(
                  (team: ShortTeam) => team.team_id === Number(e.target.value)
                );

              if (e.target.value === "other") {
                setIsOther(true);
                setValue(`answers.${index}.player.team_id`, "other");
              } else if (e.target.value === "free-agent") {
                setIsOther(false);
                setValue(`answers.${index}.player.team_name`, "");
                setValue(`answers.${index}.player.team_id`, "free-agent");
              } else if (selectedTeam) {
                setIsOther(false);
                setValue(
                  `answers.${index}.player.team_name`,
                  selectedTeam.team_name
                );
              }
            },
          })}
        >
          <option value="">{t("dropdown.placeholder")}</option>
          {field.properties?.player_block_choices?.teams.map(
            (team: ShortTeam) => (
              <option key={team.team_id} value={team.team_id}>
                {team.team_name}
              </option>
            )
          )}
          <option value="free-agent">Unsure / Free Agent</option>
          <option value="other">Other</option>
        </select>
      </div>
      {isOther === true && (
        <div>
          <h4 className={styles.question}>Enter Team Name</h4>
          <input
            className={styles.input}
            type="text"
            onChange={(e) => {
              setValue(`answers.${index}.player.team_name`, e.target.value);
            }}
          />
        </div>
      )}
      {fieldError && (
        <span className={styles.errorMessage}>{fieldError.message}</span>
      )}
    </section>
  );
};

export default PlayerBlock;
