import React, { useState } from "react";
import styles from "./PlayerForm.module.css";
import { PlayerFormProps } from "./types";
import Modal from "../../Modal/Modal";
import { useTranslation } from "react-i18next";
import { TeamType } from "../../../pages/Teams/types";
import { SeasonType } from "../../../pages/Seasons/types";
import { LeagueType } from "../../../pages/Leagues/types";
import { DivisionType } from "../../../pages/Division/types";
import {
  useGetSession,
  useUpdatePlayerTeams,
} from "../../../api/users/mutations";

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
  const [selectedLeague, setSelectedLeague] = useState(player.league_id || 0);
  const [selectedSeason, setSelectedSeason] = useState(player.season_id || 0);
  const [selectedDivision, setSelectedDivision] = useState(
    player.division_id || 0
  );

  let teamValue;
  if (player.teams?.length ?? 0 > 0) {
    teamValue = player.teams?.[0]?.id || 0;
  } else {
    teamValue = -1;
  }
  const [selectedTeam, setSelectedTeam] = useState(teamValue);

  const getSessionDataMutation = useGetSession();
  const updatePlayerTeamsMutation = useUpdatePlayerTeams();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const getSessionData = {
      formData: {
        division_id: selectedDivision,
        season_id: selectedSeason,
      },
    };

    const session = await getSessionDataMutation.mutateAsync(getSessionData);

    const updatePlayerTeamsData = {
      id: player.id,
      formData: {
        team_id: selectedTeam,
        session_id: session.id,
      },
    };

    switch (requestType) {
      case "PATCH":
        updatePlayerTeamsMutation.mutate(updatePlayerTeamsData);
        break;
      default:
        throw Error("No request type was supplied");
    }
    afterSave();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <label className={styles.label}>
          {t("formContent.unlinkLinkToTeam")}
        </label>
      </div>
      <div className={styles.inputContainer}>
        <label className={styles.label}>League</label>
        <select
          id="leagueId"
          name="leagueId"
          className={styles.input}
          value={selectedLeague}
          onChange={(e) => {
            setSelectedLeague(Number(e.target.value));
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
          <select
            id="seasonId"
            name="seasonId"
            className={styles.input}
            value={selectedSeason}
            onChange={(e) => {
              setSelectedSeason(Number(e.target.value));
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
          <select
            id="divisionId"
            name="divisionId"
            className={styles.input}
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(Number(e.target.value));
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
          <select
            id="teamId"
            name="teamId"
            className={styles.input}
            value={selectedTeam}
            onChange={(e) => {
              setSelectedTeam(Number(e.target.value));
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
