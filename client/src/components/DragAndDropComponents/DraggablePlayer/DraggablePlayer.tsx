import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import styles from "./DraggablePlayer.module.css";
import DraggableSubMenu from "../DraggableSubMenu/DraggableSubMenu";
import Switch from "react-switch";
// import { useTranslation } from "react-i18next";
import { DraggableProps } from "../types";
import { getLeaguesByGroupId } from "../../../api/leagues/service";
import { getSeasonsByLeagueId } from "../../../api/seasons/services";
import Cookies from "js-cookie";
import { LeagueType } from "../../../pages/Leagues/types";
import { SeasonType } from "../../../pages/Seasons/types";
import { getDivisionsBySeasonId } from "../../../api/divisions/service";
import { DivisionType } from "../../../pages/Division/types";
import { getTeamsBySeasonDivisionId } from "../../../api/teams/service";
import { TeamType } from "../../../pages/Teams/types";

const DraggablePlayer: React.FC<DraggableProps> = ({
  index,
  formField,
  onDelete,
  onCopy,
}) => {
  const [leagues, setLeagues] = useState<LeagueType[]>([]);
  const [seasons, setSeasons] = useState<SeasonType[]>([]);
  const [divisions, setDivisions] = useState<DivisionType[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>(
    `${formField.division_name}.${formField.division_id}`
  );
  const [selectedSeason, setSelectedSeason] = useState<string>(
    `${formField.season_name}.${formField.season_id}`
  );
  const [selectedLeague, setSelectedLeague] = useState<string>(
    `${formField.league_name}.${formField.league_id}`
  );
  const groupId = Number(Cookies.get("group_id")) || 0;

  useEffect(() => {
    const fetchLeagues = async () => {
      const leaguesData: LeagueType[] = await getLeaguesByGroupId({
        queryKey: ["league", groupId],
        signal: new AbortController().signal,
        meta: undefined,
      });

      const uniqueLeagues = leaguesData.filter(
        (league: LeagueType, index: number, self: LeagueType[]) =>
          index === self.findIndex((l: LeagueType) => l.id === league.id)
      );
      setLeagues(uniqueLeagues);
    };
    fetchLeagues();
  }, [selectedLeague]);

  useEffect(() => {
    const fetchSeasons = async () => {
      const seasonsData = await Promise.all(
        leagues.map(async (league) => {
          const leagueId = league.id as number;
          const seasons = await getSeasonsByLeagueId({
            queryKey: ["season", leagueId],
            signal: new AbortController().signal,
            meta: undefined,
          });
          return seasons;
        })
      );
      const allSeasons = seasonsData.flat();
      const uniqueSeasons = allSeasons.filter(
        (season, index, self) =>
          index === self.findIndex((s) => s.id === season.id)
      );

      setSeasons(uniqueSeasons);
    };
    if (selectedLeague !== "") {
      fetchSeasons();
    }
  }, [selectedLeague, leagues]);

  useEffect(() => {
    const seasonId = Number(selectedSeason.split(".")[1]);
    const fetchDivisions = async () => {
      const divisionData: DivisionType[] = await getDivisionsBySeasonId({
        queryKey: ["division", seasonId],
        signal: new AbortController().signal,
        meta: undefined,
      });
      const uniqueDivisions = divisionData.filter(
        (division, index, self) =>
          index === self.findIndex((d) => d.id === division.id)
      );
      setDivisions(uniqueDivisions);
    };
    if (selectedSeason !== "") {
      fetchDivisions();
    }
  }, [selectedSeason]);

  useEffect(() => {
    if (divisions.length > 0) {
      const seasonId = Number(selectedSeason.split(".")[1]);
      const fetchTeams = async () => {
        await Promise.all(
          divisions.map(async (division) => {
            const divisionId = division.id as number;
            const teamsData = await getTeamsBySeasonDivisionId({
              queryKey: ["team", seasonId, divisionId],
              signal: new AbortController().signal,
              meta: undefined,
            });
            const teams = teamsData.map((team: TeamType) => ({
              team_name: team.name,
              team_id: team.id,
            }));
            setValue(
              `fields.${index}.properties.player_block_choices.teams`,
              teams
            );
          })
        );
      };
      if (selectedDivision !== "" && selectedSeason !== "") {
        fetchTeams();
      }
    }
  }, [selectedDivision, selectedSeason, seasons]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { control, setValue } = useFormContext();

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Draggable draggableId={formField.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          onClick={handleClick}
        >
          <div style={{ position: "relative" }}>
            <p className={styles.textElementTypeText}>Player</p>
            <div className={styles.draggableContainer}>
              {formField.validations?.required != null && (
                <div className={styles.requiredSwitch}>
                  <p className={styles.requiredText}>Required</p>
                  <Controller
                    name={`fields.${index}.validations.required`}
                    control={control}
                    defaultValue={formField.validations.required}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={(checked) => field.onChange(checked)}
                        offColor="#DFE5EE"
                        onColor="#DFE5EE"
                        offHandleColor="#AAAAAA"
                        onHandleColor="#B01254"
                        handleDiameter={24}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        height={16}
                        width={44}
                      />
                    )}
                  />
                </div>
              )}
              <div className={styles.playerContainer}>
                <p className={styles.title}>Player</p>

                <div className={styles.playerContainerItem}>
                  <p className={styles.subtitle}>League: </p>
                  <Controller
                    name={`fields.${index}.league`}
                    control={control}
                    defaultValue={selectedLeague}
                    render={({ field }) => (
                      <select
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedLeague(e.target.value);
                          const leagueId = Number(e.target.value.split(".")[1]);
                          const leagueName = e.target.value.split(".")[0];
                          setValue(`fields.${index}.league_name`, leagueName);
                          setValue(`fields.${index}.league_id`, leagueId);
                        }}
                      >
                        <option value="">Select a league</option>
                        {leagues.map((league) => (
                          <option
                            key={league.id}
                            value={`${league.name}.${league.id}`}
                          >
                            {league.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
                <div className={styles.playerContainerItem}>
                  <p className={styles.subtitle}>Season: </p>
                  <Controller
                    name={`fields.${index}.season`}
                    control={control}
                    defaultValue={selectedSeason}
                    render={({ field }) => (
                      <select
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedSeason(e.target.value);
                          const seasonId = Number(e.target.value.split(".")[1]);
                          const seasonName = e.target.value.split(".")[0];
                          setValue(`fields.${index}.season_id `, seasonId);
                          setValue(`fields.${index}.season_name`, seasonName);
                        }}
                      >
                        <option value="">Select a season</option>
                        {seasons
                          .filter(
                            (season) =>
                              season.league_id ===
                              Number(selectedLeague.split(".")[1])
                          )
                          .map((season) => (
                            <option
                              key={season.id}
                              value={`${season.name}.${season.id}`}
                            >
                              {season.name}
                            </option>
                          ))}
                      </select>
                    )}
                  />
                </div>
                <div className={styles.playerContainerItem}>
                  <p className={styles.subtitle}>Division: </p>
                  <Controller
                    name={`fields.${index}.division`}
                    control={control}
                    defaultValue={selectedDivision}
                    render={({ field }) => (
                      <select
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedDivision(e.target.value);
                          const divisionId = Number(
                            e.target.value.split(".")[1]
                          );
                          const divisionName = e.target.value.split(".")[0];
                          setValue(`fields.${index}.division_id `, divisionId);
                          setValue(
                            `fields.${index}.division_name`,
                            divisionName
                          );
                        }}
                      >
                        <option value="">Select a division</option>
                        {divisions.map((division) => (
                          <option
                            key={division.id}
                            value={`${division.name}.${division.id}`}
                          >
                            {division.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
              </div>
              {isMenuOpen && (
                <DraggableSubMenu
                  onDelete={onDelete}
                  onCopy={onCopy}
                  onClose={handleClick}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggablePlayer;
