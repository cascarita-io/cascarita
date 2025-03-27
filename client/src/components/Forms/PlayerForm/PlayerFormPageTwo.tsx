import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import styles from "../Form.module.css";
import { PlayerFormPageProps } from "./types";

const PlayerFormPageTwo: React.FC<PlayerFormPageProps> = ({
  leagues,
  seasons,
  divisions,
  teams,
}) => {
  const { t } = useTranslation("Players");
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const isLinkedToTeam = watch("link_to_team");
  const selectedLeague = watch("league_id");
  const selectedSeason = watch("season_id");
  const selectedDivision = watch("division_id");

  return (
    <>
      <fieldset className={styles.radioContainer}>
        <legend className={styles.legend}>
          {t("formContent.unlinkLinkToTeam")}
        </legend>

        {RADIO_OPTIONS.map((option) => (
          <div key={option.value} className={styles.radioContainer}>
            <input
              {...register("link_to_team")}
              type="radio"
              id={`isLinkToSeason-${option.value}`}
              value={option.value}
              checked={isLinkedToTeam === option.value}
            />
            <label
              className={styles.label}
              htmlFor={`isLinkToSeason-${option.value}`}>
              {option.label}
            </label>
          </div>
        ))}
      </fieldset>

      {isLinkedToTeam === "yes" && (
        <>
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="leagueId">
              League
            </label>
            <select
              {...register("league_id", {
                setValueAs: (value) => (value === "" ? 0 : Number(value)),
              })}
              className={`${styles.input} ${errors.team_name ? styles.invalid : ""}`}
              id="leagueId">
              <option value={0}>Select a league</option>
              {leagues?.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>

          {selectedLeague > 0 && (
            <>
              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="seasonId">
                  Season
                </label>
                <select
                  {...register("season_id", {
                    setValueAs: (value) => (value === "" ? 0 : Number(value)),
                  })}
                  className={`${styles.input} ${errors.team_name ? styles.invalid : ""}`}
                  id="seasonId">
                  <option value={0}>Select a season</option>
                  {seasons
                    ?.filter((season) => season.league_id === selectedLeague)
                    .map((season) => (
                      <option key={season.id} value={season.id}>
                        {season.name}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          {selectedSeason > 0 && (
            <>
              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="divisionId">
                  Division
                </label>
                <select
                  {...register("division_id", {
                    setValueAs: (value) => (value === "" ? 0 : Number(value)),
                  })}
                  className={`${styles.input} ${errors.team_name ? styles.invalid : ""}`}
                  id="divisionId">
                  <option value={0}>Select a division</option>
                  {divisions
                    ?.filter(
                      (division) => division.season_id === selectedSeason,
                    )
                    .map((division) => (
                      <option key={division.id} value={division.id}>
                        {division.name}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          {selectedDivision > 0 && (
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="teamName">
                Team Name
              </label>
              <select
                {...register("team_id", {
                  setValueAs: (value) => (value === "" ? 0 : Number(value)),
                })}
                className={`${styles.input} ${errors.team_name ? styles.invalid : ""}`}
                id="teamName">
                <option value={0}>Select a team</option>
                {teams
                  ?.filter((team) => team.division_id === selectedDivision)
                  .map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </>
      )}
    </>
  );
};

const RADIO_OPTIONS = [
  {
    label: "Yes",
    value: "yes",
  },
  {
    label: "No",
    value: "no",
  },
];

export default PlayerFormPageTwo;
