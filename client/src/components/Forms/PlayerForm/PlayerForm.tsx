import React, { useState } from "react";
import styles from "./PlayerForm.module.css";
import { PlayerFormProps } from "./types";
import Modal from "../../Modal/Modal";
import { useTranslation } from "react-i18next";
import { PlayerType, ShortTeamType } from "../../../pages/Players/types";
import { TeamType } from "../../../pages/Teams/types";
import { useQueries } from "@tanstack/react-query";
import { getDivisionByGroupId } from "../../../api/divisions/service";
import { getSeasonsByGroupId } from "../../../api/seasons/services";
import { getTeamsByGroupId } from "../../../api/teams/service";
import { getLeagueByGroupId } from "../../../api/leagues/service";
import Cookies from "js-cookie";
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
  const [updatedPlayer, setUpdatedPlayer] = useState<PlayerType>(player);
  //   const [leagues, setLeagues] = useState<LeagueType[]>(leagues);
  const [selectedLeague, setSelectedLeague] = useState(0);
  //   const [seasons, setSeasons] = useState<SeasonType[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(0);
  //   const [divisions, setDivisions] = useState<DivisionType[]>([]);
  const [selectedDivision, setSelectedDivision] = useState(0);
  //   const [teams, setTeams] = useState<TeamType[]>([]);
  const [selectedTeam, setSelectedTeam] = useState(0);

  //   const results = useQueries({
  //     queries: [
  //       {
  //         queryKey: ["seasons", groupId],
  //         queryFn: async () =>
  //           await getSeasonsByGroupId({
  //             queryKey: ["seasons", groupId],
  //             meta: undefined,
  //             signal: new AbortController().signal,
  //           }),
  //         enabled: groupId !== 0,
  //       },
  //       {
  //         queryKey: ["divisions", groupId],
  //         queryFn: async () =>
  //           await getDivisionByGroupId({
  //             queryKey: ["divisions", groupId],
  //             meta: undefined,
  //             signal: new AbortController().signal,
  //           }),
  //         enabled: groupId !== 0,
  //       },
  //       {
  //         queryKey: ["leagues", groupId],
  //         queryFn: async () =>
  //           await getLeagueByGroupId({
  //             queryKey: ["leagues", groupId],
  //             meta: undefined,
  //             signal: new AbortController().signal,
  //           }),
  //         enabled: groupId !== 0,
  //       },
  //       {
  //         queryKey: ["teams", groupId],
  //         queryFn: async () =>
  //           await getTeamsByGroupId({
  //             queryKey: ["teams", groupId],
  //             meta: undefined,
  //             signal: new AbortController().signal,
  //           }),
  //         enabled: groupId !== 0,
  //       },
  //     ],
  //   });

  //   const [seasonsQuery, divisionsQuery, leaguesQuery, teamsQuery] = results;
  //   setLeagues(leaguesQuery.data);
  //   setSeasons(seasonsQuery.data);
  //   setDivisions(divisionsQuery.data);
  //   setTeams(teamsQuery.data);
  const getSessionDataMutation = useGetSession();
  const updatePlayerTeamsMutation = useUpdatePlayerTeams();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const updatePlayerTeamsMutation = useUpdatePlayerTeams();
    console.log("selectedDivision: ", selectedDivision);
    console.log("selectedSeason: ", selectedSeason);

    const getSessionData = {
      formData: {
        division_id: selectedDivision,
        season_id: selectedSeason,
      },
    };

    const session = await getSessionDataMutation.mutateAsync(getSessionData);
    console.log("session: ", session);

    const updatePlayerTeamsData = {
      id: player.id,
      formData: {
        team_id: selectedTeam,
        session_id: session.id,
      },
    };

    // // TODO: Refactor mutations to not rely on season but rather division
    switch (requestType) {
      case "PATCH":
        console.log("HERE I AM");
        updatePlayerTeamsMutation.mutate(updatePlayerTeamsData);
        break;
      default:
        throw Error("No request type was supplied");
    }
    afterSave();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* <div className={styles.inputContainer}>
        <label className={styles.label}>
          {t("formContent.unlinkLinkToTeam")}
        </label>
        <input
          required
          className={styles.input}
          type="text"
          placeholder={t("formContent.namePlaceholder")}
          id="teamName"
          name="teamName"
          value={teamName}
          onChange={(event) =>
            setTeamName(event.target.value.replaceAll("/", ""))
          }
        />
      </div> */}
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
            onChange={(e) => {
              setSelectedTeam(Number(e.target.value));
            }}
          >
            <option value="0">Select a team</option>
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
      {/* <div>
        <div className={styles.multiSelectContainer}></div>
        {teams?.map((team: TeamType) => (
          <div key={team.id} className={styles.multiSelectItem}>
            <input
              type="checkbox"
              id={`team-${team.id}`}
              name="teams"
              value={team.id}
              checked={(updatedPlayer.teams ?? []).some(
                (playerTeam: ShortTeamType) => playerTeam.id === team.id
              )}
              onChange={(e) => {
                const selectedTeams = e.target.checked
                  ? [...(updatedPlayer.teams ?? []), team]
                  : (updatedPlayer.teams ?? []).filter(
                      (playerTeam: ShortTeamType) => playerTeam.id !== team.id
                    );
                setUpdatedPlayer({ ...updatedPlayer, teams: selectedTeams });
              }}
            />
            <label style={{ paddingLeft: "5px" }} htmlFor={`team-${team.id}`}>
              {team.name}
            </label>
          </div>
        ))}
      </div> */}

      {/* {seasonId !== 0 && (
        <div className={styles.inputContainer}>
          <label className={styles.label}>{t("formContent.division")}</label>
          <select
            id="divisionId"
            name="divisionId"
            value={divisionId}
            className={styles.input}
            onChange={(e) => setDivisionId(Number(e.target.value))}
            required={linkToSeason}
          >
            <option value="">Select a division</option>
            {divisionsData?.map((division: DivisionType) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.inputContainer}>
        <label className={styles.label}>{t("formContent.linkToSeason")}</label>
        <input
          type="checkbox"
          id="linkToSeason"
          name="linkToSeason"
          checked={linkToSeason}
          onChange={(e) => setLinkToSeason(e.target.checked)}
        />
      </div>

      <div className={styles.inputContainer}>
        <label className={styles.label}>{t("formContent.logo")}</label>

        <FileUpload className={styles.logoInputContainer} />
      </div> */}

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
