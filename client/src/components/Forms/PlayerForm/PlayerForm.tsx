import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "../Form.module.css";
import { PlayerFormData, PlayerFormProps, PlayerRequest } from "./types";
import Modal from "../../Modal/Modal";
import { useTranslation } from "react-i18next";
import { TeamType } from "../../../pages/Teams/types";
import { SeasonType } from "../../../pages/Seasons/types";
import { LeagueType } from "../../../pages/Leagues/types";
import { DivisionType } from "../../../pages/Division/types";
import {
  useGetPlayerSession,
  useUpdatePlayerTeams,
} from "../../../api/users/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { playerSchema } from "./schema";

const PlayerForm: React.FC<PlayerFormProps> = ({
  afterSave,
  requestType,
  player,
  leagues,
  seasons,
  divisions,
  teams,
}) => {
  const { t } = useTranslation("Players");
  const [error, setError] = React.useState("");
  const [selectedLeague, setSelectedLeague] = useState(player.league_id || 0);
  const [selectedSeason, setSelectedSeason] = useState(player.season_id || 0);
  const [selectedDivision, setSelectedDivision] = useState(
    player.division_id || 0
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<PlayerFormData>({
    defaultValues: {
      season_id: player.season_id || 0,
      division_id: player.division_id || 0,
      league_id: player.league_id || 0,
      team_id:
        (player.teams?.length ?? 0 > 0) ? player.teams?.[0]?.id || 0 : -1,
    },
    resolver: zodResolver(playerSchema),
  });

  const getSessionDataMutation = useGetPlayerSession();
  const updatePlayerTeamsMutation = useUpdatePlayerTeams();

  const onSubmit: SubmitHandler<PlayerFormData> = async (
    data: PlayerFormData
  ) => {
    const { season_id, division_id, team_id } = data;

    const getPlayerSessionData = {
      division_id: division_id,
      season_id: season_id,
    };

    const session =
      await getSessionDataMutation.mutateAsync(getPlayerSessionData);

    const updatePlayerTeamsData = {
      id: player.id,
      team_id: team_id,
      session_id: session.id,
    };

    switch (requestType) {
      case "PATCH": {
        const dataUpdate = await updatePlayerTeamsMutation.mutateAsync(
          updatePlayerTeamsData as PlayerRequest
        );
        if (dataUpdate.error) {
          setError(dataUpdate.error);
          return;
        }
        break;
      }
      default:
        throw Error("No request type was supplied");
    }
    afterSave();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputContainer}>
        <label className={styles.label}>
          {t("formContent.unlinkLinkToTeam")}
        </label>
      </div>
      {error && <span className={styles.error}>{error}</span>}
      <div className={styles.inputContainer}>
        <label className={styles.label}>League</label>
        {errors.league_id && (
          <span className={styles.error}>{errors.league_id.message}</span>
        )}
        <select
          {...register("league_id")}
          id="leagueId"
          name="leagueId"
          className={styles.input}
          onChange={(e) => {
            setSelectedLeague(Number(e.target.value));
            setError("");
            clearErrors("league_id");
          }}
        >
          <option value="0">Select a league</option>
          {leagues?.map((league: LeagueType) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>
      </div>
      {selectedLeague !== 0 && (
        <div className={styles.inputContainer}>
          <label className={styles.label}>Season</label>
          {errors.season_id && (
            <span className={styles.error}>{errors.season_id.message}</span>
          )}
          <select
            {...register("season_id")}
            id="seasonId"
            name="seasonId"
            className={styles.input}
            onChange={(e) => {
              setSelectedSeason(Number(e.target.value));
              setError("");
              clearErrors("season_id");
            }}
          >
            <option value="0">Select a season</option>
            {seasons
              ?.filter(
                (season: SeasonType) => season.league_id === selectedLeague
              )
              .map((season: SeasonType) => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
          </select>
        </div>
      )}
      {selectedSeason !== 0 && (
        <div className={styles.inputContainer}>
          <label className={styles.label}>Division</label>
          {errors.division_id && (
            <span className={styles.error}>{errors.division_id.message}</span>
          )}
          <select
            {...register("division_id")}
            id="divisionId"
            name="divisionId"
            className={styles.input}
            onChange={(e) => {
              setSelectedDivision(Number(e.target.value));
              setError("");
              clearErrors("division_id");
            }}
          >
            <option value="0">Select a division</option>
            {divisions
              ?.filter(
                (division: DivisionType) =>
                  division.season_id === selectedSeason
              )
              .map((division: DivisionType) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
          </select>
        </div>
      )}
      {selectedDivision !== 0 && (
        <div className={styles.inputContainer}>
          <label className={styles.label}>Team</label>
          {errors.team_id && (
            <span className={styles.error}>{errors.team_id.message}</span>
          )}
          <select
            {...register("team_id")}
            id="teamId"
            name="teamId"
            className={styles.input}
            onChange={() => {
              setError("");
              clearErrors("team_id");
            }}
          >
            <option value={0}>Select a team</option>
            <option value={-1}>Free agent</option>
            {teams
              ?.filter(
                (team: TeamType) => team.division_id === selectedDivision
              )
              .map((team: TeamType) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
          </select>
        </div>
      )}

      <div className={styles.formBtnContainer}>
        <Modal.Close className={`${styles.btn} ${styles.cancelBtn}`}>
          {t("formContent.cancel")}
        </Modal.Close>

        <div>
          <button type="submit" className={`${styles.btn} ${styles.submitBtn}`}>
            {t("formContent.submit")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlayerForm;
